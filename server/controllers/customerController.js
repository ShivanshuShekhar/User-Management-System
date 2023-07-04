const Customer = require('../models/Customer');
const mongoose = require('mongoose');

/**
 * GET /
 * Homepage
*/

exports.homepage = async (req, res) => {

    const messages = await req.consumeFlash('info');

    const locals = {
        title: 'GPMS-BHEL',
        description: 'Gate Pass Management System',
    }

    let perPage = 12;
    let page = req.query.page || 1;

    try {

        const customers = await Customer.aggregate([{ $sort: { updatedAt: -1 } }])
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec();

        const count = await Customer.count();

        res.render('index', {
            locals,
            customers,
            current: page,
            pages: Math.ceil(count / perPage),
            messages
        });

    } catch (error) {
        console.log(error);
    }

}



// exports.homepage = async (req, res) => {

//     const messages = await req.consumeFlash('info');

//     const locals = {
//         title: 'GPMS-BHEL',
//         description: 'Gate Pass Management System',
//     }

//     try {
//         const customers = await Customer.find({}).limit(22);
//         res.render('index', { locals, messages, customers });
//     } catch (error) {
//         console.log(error);
//     }

// }


/**
 * GET /
 * New Customer Form
*/

exports.addCustomer = async (req, res) => {

    const locals = {
        title: 'Add New Customer',
        description: 'Gate Pass Management System',
    }

    res.render('customer/add', locals);

}

/**
 * POST /
 * Create New Customer Form
*/

exports.postCustomer = async (req, res) => {

    console.log(req.body);

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tel: req.body.tel,
        email: req.body.email,
        details: req.body.details
    })

    try {
        await Customer.create(newCustomer);
        await req.flash('info', 'New customer has been added.');

        res.redirect('/');
    } catch (error) {
        console.log(error);
    }

}


/**
 * GET /
 * View Customer Data
*/

exports.view = async (req, res) => {

    try {
        const customer = await Customer.findOne({ _id: req.params.id })

        const locals = {
            title: 'View Customer Data',
            description: 'Gate Pass Management System',
        };

        res.render('customer/view', {
            locals,
            customer
        })

    } catch (error) {
        console.log(error);
    }

}


/**
 * GET /
 *  Edit Customer Data
*/

exports.edit = async (req, res) => {

    try {
        const customer = await Customer.findOne({ _id: req.params.id })

        const locals = {
            title: 'Edit Customer Data',
            description: 'Gate Pass Management System',
        };

        res.render('customer/edit', {
            locals,
            customer
        })

    } catch (error) {
        console.log(error);
    }

}


/**
 * PUT /
 *  Update Customer Data
*/

exports.editPost = async (req, res) => {

    try {

        await Customer.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            tel: req.body.tel,
            email: req.body.email,
            details: req.body.details,
            updatedAt: Date.now()
        });

        res.redirect(`/edit/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }

}


/**
 * DELETE /
 *  Delete Customer Data
*/

exports.deleteCustomer = async (req, res) => {

try {
    await Customer.deleteOne({ _id: req.params.id });
    res.redirect("/");
} catch (error) {
    console.log(error);
}

}


/**
 * POST /
 *  Search Customer Data
*/

exports.searchCustomer = async (req, res) => {

    const locals = {
        title: 'Search Customer Data',
        description: 'Gate Pass Management System',
    };

    try {
        
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const customers = await Customer.find({
            $or: [
                { firstName: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { lastName: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
            ]
        });

        res.render("search", {
            customers,
            locals
        });

    } catch (error) {
        console.log(error);
    }
    
    }