import Bon from '../models/bonModel.js';
import moment from 'moment';

//create new bon
export const createBon = async (req, res, next) => {
	try {
		const newBon = new Bon({
			...req.body,
		});
		const savedBon = await newBon.save();

		return res.status(201).json(savedBon);
	} catch (error) {
		next(error);
	}
};

//update new bon
export const updateBon = async (req, res, next) => {
	try {
		const updatedBon = await Bon.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		return res.status(200).json(updatedBon);
	} catch (error) {
		next(error);
	}
};

// delete bon
export const deleteBon = async (req, res, next) => {
	try {
		await Bon.findByIdAndDelete(req.params.id);
		return res.status(200).json('Bon has been deleted');
	} catch (error) {
		next(error);
	}
};

//get one
export const getBon = async (req, res, next) => {
	try {
		const bon = await Bon.find({ _id: req.params.id });
		res.status(200).json(bon);
	} catch (error) {
		next(error);
	}
};

//get all
export const getAll = async (req, res, next) => {
	try {
		const bons = await Bon.find();
		res.status(200).json(bons);
	} catch (error) {
		next(error);
	}
};

//get stats with month id
export const getProductsCreatedThisMonth = async (req, res) => {
	try {
		const now = moment();
		const startOfMonth = now.startOf('month').toDate();
		const endOfMonth = now.endOf('month').toDate();

		const products = await Bon.find({
			createdAt: {
				$gte: startOfMonth,
				$lt: endOfMonth,
			},
		});

		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//get sells stats
export const getSellsStats = async (req, res, next) => {
	try {
		const bons = await Bon.aggregate([
			{
				$group: {
					_id: { $substr: ['$createdAt', 0, 7] },
					sales: {
						$sum: {
							$cond: {
								if: { $gt: ['$totalRemise', null] },
								then: '$totalRemise',
								else: '$total',
							},
						},
					},
					transport: { $sum: '$transport' },
				},
			},
		]);
		res.status(200).json(bons);
	} catch (error) {
		next(error);
	}
};
