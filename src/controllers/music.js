const { music, artis } = require('../../models')
const cloudinary = require("../../utils/cloudinary");

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
            attache: process.env.FILE_PATH + item.attache
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
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "dumbmerch_file",
        use_filename: true,
        unique_filename: false,
      })
      const data = req.body;
      let newMusic = await music.create({
        ...data,
        title: req.body.title,
        year: req.body.year,
        thumbnail: req.files.thumbnail[0].filename,
        attache: req.files.attache[0].filename,
      });
  
      newMusic = JSON.parse(JSON.stringify(newMusic));
      newMusic = {
        ...newMusic,
      };
  
      res.status(200).send({
        status: "success",
        data: {
          newMusic,
        },
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "failed to add Music",
      });
    }
  };
