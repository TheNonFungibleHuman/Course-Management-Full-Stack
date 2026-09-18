import * as dashboardModel from "../models/dashboardModel.js";

async function getDashboardStats(req, res, next) {
  try {
    const stats = await dashboardModel.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export { getDashboardStats };
