import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';
const { spawn } = require('child_process');


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') { // only accept pdf files
        cb(null, true);
    } else {
        cb(new Error('Wrong type'));
    }
}

const upload = multer({
    storage: multer.diskStorage({
        destination: './lib/docsTopicModeling',
        filename: (req, file, cb) => cb(null, file.originalname.split(".")[0].replace(/_/g, '') + '_' + file.fieldname + '_' + Date.now() + '.' + file.mimetype.split('/')[1]),
    }),
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 6 // 6MB
    },
});

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(400).json({ error: `Error: ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.use(upload.array('files'));

apiRoute.post((req, res) => {
    return new Promise(function (resolve, reject) {
        const libDirectory = path.join(process.cwd(), 'lib');
        let files = req.files.map((file) => {
            return `${libDirectory}/docsTopicModeling/${file.filename}`;
        });
        const userID = uuidv4();
        const pythonPath = "C:/Users/brend/AppData/Local/Programs/Python/Python310/python.exe"; // path to python 3.9.13 virtual environment with all required libraries
        const pythonProcess = spawn(pythonPath, [libDirectory + '/topicModeling.py', ...files, userID, libDirectory + '/dataTopicModeling']);
        console.log('Running python script...');
        let bufferArray= []
        pythonProcess.stdout.on('data', (data) => {
            bufferArray.push(data);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            files.forEach(element => {
                fs.unlink(element, (err) => { });
            });
            if (code !== 0) {
                console.log(`child process exited with code ${code}`);
                res.status(500).send('Internal error');
                fs.rmdir(libDirectory + '/dataTopicModeling/' + userID, { recursive: true, force: true }, (err) => { });
            }
            else {
                let dataBuffer = Buffer.concat(bufferArray);
                console.log(dataBuffer.toString())
                res.setHeader('content-type', 'application/json');
                res.status(200).send(dataBuffer);
                setTimeout(() => {
                    fs.rmdir(libDirectory + '/dataTopicModeling/' + userID, { recursive: true, force: true }, (err) => { });
                }, 60000 * 30); // delete folder after 30 minutes
            }
            resolve();
        });
    });
});

export default apiRoute;

// Disallow body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};