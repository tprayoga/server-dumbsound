const { premium } = require('../../models')

exports.addPremium = async (req, res) => {
    try {
        const { body } = req

        const premiumData = await premium.create(body)

        res.send({
            status: 'success',
            message: 'premium Successfully Add',
            data: premiumData
        })

    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error',
        })
    }
}


exports.getPremium = async (req, res) => {
    try {
        const premiums = await premium.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        })

        res.send({
            status: 'success',
            message: 'User Successfully Get',
            data: {
                premiums
            }
        })
    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error',
        })
    }
}