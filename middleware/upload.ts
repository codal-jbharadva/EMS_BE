import multer from "multer"

const storage = multer.diskStorage({
    destination: function(req,res,cb){
        cb(null, './upload')
    },

    filename: function(req,file,cb){
        const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const originalName = file.originalname.replace(/\s/g, '_');
        return cb(null, `${uniqueSuffix}-${originalName}`);
    }
})

export const upload = multer({storage:storage});




