const dotenv = require('dotenv');
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const logger = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Models 
const AdminsModel = require('./Models/Admins');
const UsersModel = require('./Models/Users');

//Authentications
const AdminAuth = require('./Routes/AdminAuthenticate');
const UserAuth = require('./Routes/UserAuthenticate');

// Admin
const AdminsRegister = require('./Routes/Admins/Register');
const AdminsUpdate = require('./Routes/Admins/Update');
const AdminChangePassword = require('./Routes/Admins/ChangePassword');
const ViewAllAdmins = require('./Routes/Admins/ViewAll');
const ViewAdmin = require('./Routes/Admins/ViewAdmin');
const DeleteAdmin = require('./Routes/Admins/Delete');

// User
const UsersRegister = require('./Routes/Users/Register');
const UsersUpdate = require('./Routes/Users/Update');
const UserChangePassword = require('./Routes/Users/ChangePassword');
const ViewAllUsers = require('./Routes/Users/ViewAll');
const ViewUser = require('./Routes/Users/ViewUser');
const DeleteUser = require('./Routes/Users/Delete');

// Plans
const NewPlan = require('./Routes/Plans/New');
const UpdatePlan = require('./Routes/Plans/Update');
const AllPlans = require('./Routes/Plans/All');
const Plan = require('./Routes/Plans/Plan');
const DeletePlan = require('./Routes/Plans/Delete');
const FindPlan = require('./Routes/Plans/Find');
const FindPlanByUser = require('./Routes/Plans/FindForUser');

// Orders
const NewOrderByUser = require('./Routes/Orders/UserNewOrder');
const UserOrders = require('./Routes/Orders/UserOrders');


// Payments
const paymentCallback = require('./Routes/Payment/Payment');

// File Upload
const fileUpload = require('./Routes/FileUpload/FileUpload');



// Set up Global configuration access
dotenv.config();

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    header: ["x-access-token", "Origin", "X-Requested-With", "Content-Type", "Accept", "token"]
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept, token");
  next();
});

app.use(['/v1/*'], async (req, res, next) => {
    if (req.headers.token) {
        const token = jwt.verify(req.headers.token, process.env.ADMINTOKEN, async (err,result) => {
            if (err) {
                res.status(400).json({
                    code: 400,
                    error: 'Invalid Access',
                    message: 'Please Login again!'
                });
            } else {
                const user = await AdminsModel.findOne({
                    username: result.username
                });
                if (user) {
                  app.set('user', result)
                  next();
                } else {
                    res.status(400).json({
                        code: 400,
                        error: 'Invalid Access',
                        message: 'Please Login again!'
                    });
                }
            }
        });
    } else {
        res.status(400).json({
            code: 400,
            error: 'Invalid Access',
            message: 'No Header token found'
        });
    }
});
app.use(['/v2/*'], async (req, res, next) => {
    if (req.headers.token) {
        const token = jwt.verify(req.headers.token, process.env.USERTOKEN, async (err,result) => {
            if (err) {
                res.status(400).json({
                    code: 400,
                    error: 'Invalid Access',
                    message: 'Please Login again!'
                });
            } else {
                const user = await UsersModel.findOne({
                    mobile: result.mobile
                });
                if (user) {
                  app.set('user', result)
                  next();
                } else {
                    res.status(400).json({
                        code: 400,
                        error: 'Invalid Access',
                        message: 'Please Login again!'
                    });
                }
            }
        });
    } else {
        res.status(400).json({
            code: 400,
            error: 'Invalid Access',
            message: 'No Header token found'
        });
    }
});
  app.use(logger('dev'));

const server_port = process.env.PORT;
const server_host = process.env.BASE_URL;

mongoose.connect(process.env.MONGODBASE_URL, { useNewUrlParser: true })
.then(() => {
    // Public Routes // Not Protected and must not use /v1 or /v2 for these routes. Allowed is /api/public/ route!
    // # => Register
    app.use('/api/public/anadminbysuperadmin', AdminsRegister);
    app.use('/api/public/registeruser', UsersRegister);
    // # => Authentications
    app.use('/api/public/admin/auth', AdminAuth);
    app.use('/api/public/user/auth', UserAuth);
    
    app.use('/payment/callback', paymentCallback);

    
    // Admins Route Protected By ADMINTOKEN Environment Variable and Middleware // All Items for admins must be places afte /v1 route!
    app.use('/v1/create/admin', AdminsRegister);
    app.use('/v1/create/user', UsersRegister);
    app.use('/v1/update/admin', AdminsUpdate);
    app.use('/v1/update/user', UsersUpdate);
    app.use('/v1/delete/admin', DeleteAdmin);
    app.use('/v1/delete/user', DeleteUser);
    app.use('/v1/change-password/admin', AdminChangePassword);
    app.use('/v1/change-password/user', UserChangePassword);
    app.use('/v1/view/admin', ViewAdmin);
    app.use('/v1/view/admins', ViewAllAdmins);
    app.use('/v1/view/user', ViewUser);
    app.use('/v1/view/users', ViewAllUsers);
    app.use('/v1/view/plans', AllPlans);
    app.use('/v1/view/plan', Plan);
    app.use('/v1/delete/plan', DeletePlan);
    app.use('/v1/create/plan', NewPlan);
    app.use('/v1/update/plan', UpdatePlan);
    app.use('/v1/find/plan', FindPlan);
    
    app.use('/v1/files/upload', fileUpload);


    // User Route Protected By USERTOKEN Environment Variable and Middleware // All Items for users must be places afte /v2 route!
    app.use('/v2/update/user', UsersUpdate);
    app.use('/v2/change-password/user', UserChangePassword);
    app.use('/v2/view/user', ViewUser);
    app.use('/v2/find/plan', FindPlanByUser);
    app.use('/v2/create/order', NewOrderByUser);
    app.use('/v2/view/orders', UserOrders);

    app.use('/uploads', express.static(__dirname+'/uploads/'));

    app.listen(server_port,server_host, () => {
    console.log(`Students App Started on ${server_host}:${server_port}`)
    })
  })