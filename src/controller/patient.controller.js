import database from '../config/mysql.config.js';
import Response  from '../domain/response.js';
import logger from '../util/logger.js';
import QUERY from '../query/patient.query.js';

const HttpStatus = {
    OK: { code: 200, status: 'OK'},
    CREATED: { code: 201, status: 'CREATED'},
    NO_CONTENT: { code: 204, status: 'NO_CONTENT'},
    BAD_REQUEST: { code: 400, status: 'BAD_REQUEST'},
    NOT_FOUND: { code: 404, status: 'NOT_FOUND'},
    INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR'}
};

export const getPatients = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching patients`);
    database.query(QUERY.SELECT_PATIENTS, (error, results) => {
        if(!results) { //error
            res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No patients found`));
        } else { //results
            res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patients retrieved`, { patients: results} ));
        }
    });
};

export const createPatient = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, creating patient`);
    database.query(QUERY.CREATE_PATIENT_PROCEDURE, Object.values(req.body), (error, results) => {
        if(!results) { //error
            logger.error(error.message); //logging mysql error message
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `No patient with the said id found`));
        } else { //results
            // const patient = { id: results.insertId, ...req.body, created_at: new Date()};
            //no need of above line since we replaced it with a stored procedure instead..
            const patient = results[0][0] ; 
            res.status(HttpStatus.CREATED.code)
                .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Patient  created`, { patient} ));
        }
    });
};



export const getPatient = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching patient`);
    database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
        if(!results[0]) { //error
            res.status(HttpStatus.NOT_FOUND.code)
                .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient with the said id ${req.params.id} was not found`));
        } else { //results
            res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient retrieved`, results[0]));
        }
    });
};

export const updatePatient = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching patient`);
    database.query(QUERY.SELECT_PATIENT, [req.params.id], (err, results) => {
        if(!results[0]) {
            res.status(HttpStatus.NOT_FOUND.code)
                .send(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient by id ${req.params.id} was not found`);
        } else {
            logger.info(`${req.method} ${req.originalUrl}, updating patient`);
            database.query(QUERY.UPDATE_PATIENT, [...Object.values(req.body), req.params.id], (error, results) => {
                if(!error) {
                    res.status(HttpStatus.OK.code)
                      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient updated`, { id: req.params.id, ...req.body}));
                } else {
                    logger.error(error.message);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occured`));
                }
            });
        }
    })
}


export const deletePatient = (req, res) => {
    logger.info(` ${req.method} ${req.originalUrl}, deleting patient`);
    database.query(QUERY.DELETE_PATIENT, [req.params.id], (error, results) => {
        if(results.affectedRows > 0) {
            res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient deleted successfully`, results[0]));             
        } else {
            res.status(HttpStatus.NOT_FOUND.code)
                .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient with id ${req.params.id} was not found`));
        }
    });
};



export default HttpStatus;