const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Organiser = require("../models/Organiser");
const jwt = require("jsonwebtoken");

router.post("/login", function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  console.log(email);
  console.log(password);

  Organiser.findOne({ email: email }, async function (err, foundCompany) {
    if (err) {
      console.log(err);
    } else {
      if (foundCompany) {
        const isMatch = await bcrypt.compare(password, foundCompany.password);
        console.log(bcrypt.compare(password, foundCompany.password));
        console.log("foundCompany ", foundCompany);
        // const token = await foundCompany.generateAuthToken();
        // console.log("The token part is: ", token);

        if (isMatch) {
          res.send({ found: true, id: foundCompany._id });
          console.log("Successfully logged In");
        } else {
          res.send({ found: "incorrect" });
          console.log("Incorrect email or password");
        }
      } else {
        res.send({ found: "incorrect" });
        console.log("Incorrect Company email or password");
      }
    }
  });
});
router.post("/register", function (req, res) {
  Organiser.find(
    { email: req.body.email },
    async function (err, foundOrganisers) {
      if (foundOrganisers.length === 0) {
        const newOrganiser = new Organiser({
          company_name: req.body.name,
          email: req.body.email,
          address: req.body.address,
          password: req.body.password,
          mobile_no: req.body.mobile,
          landline_no: req.body.landline,
          state: req.body.state,
          city: req.body.city,
          pincode: req.body.pincode,
        });

        const org = await newOrganiser.save();

        res.send(true);
      } else {
        res.send("Organiser already registered");
      }
    }
  );
});

module.exports = router;
