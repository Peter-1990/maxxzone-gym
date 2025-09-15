const Membership = require('../Models/membership.js');



exports.addMembership = async (req, res) => {
    try {
        const { months, price } = req.body;
        const membership = await Membership.findOne({ gym: req.gym._id, months });
        if (membership) {
            membership.price = price;
            await membership.save();
            res.status(200).json({ message: "Updated Successfully" });
        } else {
            const newMembership = new Membership({ price, months, gym: req.gym._id });
            await newMembership.save();
            res.status(200).json({ message: "Added Successfully", data:newMembership });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server Error" });
    }
}


exports.getMembership = async(req, res) => {
    try {
        const loggedInId = req.gym._id;
        const memberShip = await Membership.find({ gym: loggedInId });
        res.status(200).json({ message: "Membership Fetched Successfully", membership: memberShip });
    } catch (error) {
          console.log(error)
        res.status(500).json({ error: "Server Error" });
    }
}