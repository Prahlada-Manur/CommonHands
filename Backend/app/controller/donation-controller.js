const { donateValidation } = require('../validations/donation-Validation');
const Transaction = require('../model/transaction-Schema');
const Task = require('../model/task-Schema')
const OrganizationProfile = require('../model/organizationProfile-Schema')
const { v4: uuidv4 } = require('uuid');

const donationCltr = {};
//---------------------------------------------------------------------------------------------------------------------
//-------------------------------Api for making the donation-----------------------------------------------------------
donationCltr.donate = async (req, res) => {
    const { taskId } = req.params;
    const body = req.body
    try {
        const { error, value } = donateValidation.validate(body, { abortEarly: false })
        if (error) {
            return res.status(400).json({ error: error.message })
        }
        const task = await Task.findById(taskId)
        if (task?.taskType !== 'funding') {
            return res.status(400).json({ error: 'Task either not found or is not of Donation type' })
        }
        const ngo = await OrganizationProfile.findById(task.ngo)
        if (!ngo) {
            return res.status(404).json({ error: "NGO not found" })
        }
        const platformFee=value.amount *0.05;
        const netDonation=  value.amount-platformFee
        const transaction = new Transaction({
      ngo: ngo._id,
      donorDetails: {
        donorName:value.donorName,
        donorEmail:value.donorEmail,
        user: req.userId || null
      },
      transactionDetails: {
        transactionPurpose: 'Donation',
        task: task._id,
        platformFee
      },
      transactionInfo: {
        amount:value.amount,
        transactionId: uuidv4(),
        orderId: uuidv4(),
        status: 'Success',
        paymentGateway: 'Razorpay'
      }
    });

    await transaction.save();

    task.currentFund += netDonation;
    await task.save();

    ngo.lastFundingDate = new Date();
    await ngo.save();

    const populatedData = await Transaction.findById(transaction._id)
      .populate('ngo', ['ngoName',' contactEmail'])
      .populate('transactionDetails.task', 'title fundingGoal currentFund')
      .populate('donorDetails.user', 'firstName email');

    res.status(201).json({
      message: 'Donation recorded successfully (simulated)',
      transaction: populatedData
    });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}
//-------------------------------Api for get user donation--------------------------------------------------------------
donationCltr.getUserDonations = async (req, res) => {
  try {
    const userId = req.userId;

    const donations = await Transaction.find({ 'donorDetails.user': userId })
      .populate('ngo', 'ngoName contactEmail status')
      .populate('transactionDetails.task', 'title fundingGoal currentFund deadline taskStatus')
      .populate('donorDetails.user', 'firstName lastName email')
      .select('ngo donorDetails transactionDetails transactionInfo createdAt')
      .sort({ createdAt: -1 });

    if (!donations.length) {
      return res.status(404).json({ message: 'No donations found for this user' });
    }

    res.status(200).json({
      message: 'Your Donations',
      total: donations.length,
      donations
    });
  } catch (err) {
    console.error('Error fetching user donations:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
//----------------------------Api for grt ngo doantions-------------------------------------------------------------------
donationCltr.getNgoDonations = async (req, res) => {
  try {
     

    const donations = await Transaction.find({ ngo:req.ngoId })
      .populate('donorDetails.user', 'firstName lastName email')
      .populate('transactionDetails.task', 'title fundingGoal currentFund deadline taskStatus')
      .select('donorDetails transactionDetails transactionInfo createdAt')
      .sort({ createdAt: -1 });

    if (!donations.length) {
      return res.status(404).json({ message: 'No donations received yet' });
    }

    res.status(200).json({
      message: 'Donations received successfully',
      total: donations.length,
      donations
    });
  } catch (err) {
    console.error('Error fetching NGO donations:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports = donationCltr
