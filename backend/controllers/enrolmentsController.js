import * as enrolmentModel from "../models/enrolmentsModel.js";

async function getAllEnrolments(req, res, next) {
  try {
    const enrolments = await enrolmentModel.getAllEnrolments();
    res.json(enrolments);
  } catch (error) {
    next(error);
  }
}

async function getEnrolmentById(req, res, next) {
  try {
    const enrolment = await enrolmentModel.getEnrolmentById(req.params.id);

    if (!enrolment) {
      return res.status(404).json({ error: "Enrolment not found" });
    }

    res.json(enrolment);
  } catch (error) {
    next(error);
  }
}

async function createEnrolment(req, res, next) {
  try {
    const enrolment = await enrolmentModel.createEnrolment(req.body);
    res.status(201).json(enrolment);
  } catch (error) {
    next(error);
  }
}

async function updateEnrolment(req, res, next) {
  try {
    const enrolment = await enrolmentModel.updateEnrolment(
      req.params.id,
      req.body
    );

    if (!enrolment) {
      return res.status(404).json({ error: "Enrolment not found" });
    }

    res.json(enrolment);
  } catch (error) {
    next(error);
  }
}

async function deleteEnrolment(req, res, next) {
  try {
    const deleted = await enrolmentModel.deleteEnrolment(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Enrolment not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getEnrolmentDetails(req, res, next) {
  try {
    const enrolments = await enrolmentModel.getEnrolmentDetails();
    res.json(enrolments);
  } catch (error) {
    next(error);
  }
}

export {
  getAllEnrolments,
  getEnrolmentById,
  createEnrolment,
  updateEnrolment,
  deleteEnrolment,
  getEnrolmentDetails,
};
