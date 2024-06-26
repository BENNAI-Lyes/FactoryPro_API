import Client from '../models/clientModel.js';
import { hashPassword } from '../helpers/auth.js';
import moment from 'moment';

//create client
export const createClient = async (req, res, next) => {
	try {
		const newClient = new Client({
			...req.body,
		});
		const savedClient = await newClient.save();

		return res.status(201).json(savedClient);
	} catch (error) {
		next(error);
	}
};

//update client
export const updateClient = async (req, res, next) => {
	//update password
	if (req.body.password) {
		req.body.password = await hashPassword(req.body.password);
	}

	try {
		const updatedClient = await Client.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedClient);
	} catch (error) {
		next(error);
	}
};

//delete client

export const deleteClient = async (req, res, next) => {
	try {
		await Client.findByIdAndDelete(req.params.id);
		return res.status(200).json('client has been deleted');
	} catch (error) {
		next(error);
	}
};

//get one client
export const getClient = async (req, res, next) => {
	try {
		const client = await Client.findById(req.params.id);
		res.status(200).json(client);
	} catch (error) {
		next(error);
	}
};

//get all client
export const getAllClient = async (req, res, next) => {
	const query = req.query.name;

	try {
		const clients = !query
			? await Client.find()
			: await Client.find({ name: query });
		res.status(200).json(clients);
	} catch (error) {
		next(error);
	}
};

//get total in this month and prev month
export const getTotalClientsByMonth = async (req, res) => {
	try {
		const now = moment();
		const startOfCurrentMonth = now.startOf('month').toDate();
		const startOfPreviousMonth = now
			.subtract(1, 'month')
			.startOf('month')
			.toDate();

		const currentMonthCount = await Client.countDocuments({
			createdAt: { $gte: startOfCurrentMonth },
		});

		const previousMonthCount = await Client.countDocuments({
			createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth },
		});

		const totalCustomers = await Client.countDocuments();

		res.json({
			currentMonthCount,
			previousMonthCount,
			totalCustomers,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
