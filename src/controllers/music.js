const { music, artis } = require('../../models')
const cloudinary = require('../utils/cloudinary')
exports.musics = async (req, res) => {
    try {
        let musics = await music.findAll({
            include: {
                model: artis,
                as: 'artis',
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            attributes: {
                exclude: ['createdAt']
            },
        })
        musics = JSON.parse(JSON.stringify(musics))
        musics = musics.map((item)=>{
          return{
            ...item,
            thumbnail: process.env.FILE_PATH + item.thumbnail,
            attache: process.env.FILE_PATH_MUSIC + item.attache
          }
        })

        res.send({
            status: 'success',
            message: 'User Successfully Get',
            data: {
                musics: musics
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

exports.addMusic = async (req, res) => {
    try {
      const data = req.body
      const result = await cloudinary.uploader.upload(req.files.thumbnail[0].path,{
        folder: "dumbmerch_file",
        use_filename: true,
        unique_filename: false,
      })
      const resultMusic = await cloudinary.uploader.upload(req.files.attache[0].path,{
        folder: "dumbmerch_file",
        use_filename: true,
        unique_filename: false,
        resource_type: "video",
      })
      const thumbnail = result.public_id
      const attache = resultMusic.public_id

      const dataUpload ={
        ...data,
        thumbnail,
        attache
      }
      await music.create(dataUpload)
      res.status(200).send({
        status: 'success',
        message: 'Music Successfully Added',
      })
      // const result = await cloudinary.uploader.upload(req.files.path, {
      //   folder: "dumbmerch_file",
      //   use_filename: true,
      //   unique_filename: false,
      // })
      // const resultMusic = await cloudinary.uploader.upload(req.files.path, {
      //   folder: "dumbmerch_file",
      //   use_filename: true,
      //   unique_filename: false,
      //   resource_type: "raw",
      // })
      // const data = req.body;
      // let newMusic = await music.create({
      //   ...data,
      //   title: req.body.title,
      //   year: req.body.year,
      //   thumbnail: result.public_id,
      //   attache: resultMusic.public_id,
      // });
  
      // newMusic = JSON.parse(JSON.stringify(newMusic));
      // newMusic = {
      //   ...newMusic,
      // };
  
      // res.status(200).send({
      //   status: "success",
      //   data: {
      //     newMusic,
      //   },
      // });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "failed to add Music",
      });
    }
  };
