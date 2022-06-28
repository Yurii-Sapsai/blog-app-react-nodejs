import PostSchema from '../models/Post.js'

export const create = async (req, res) => {

    const userId = req.userId
    console.log(userId)

    try {
        const doc = new PostSchema({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()
        res.json(post)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed to create post',
        })
    }
}

export const getAll = async (req, res) => {

    try {
        const posts = await PostSchema.find().populate('user').exec()
        res.json(posts)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed to read posts',
        })
    }
}

export const getOne = async (req, res) => {

    try {
        const postId = req.params.id
        PostSchema.findOneAndUpdate({
            _id: postId,
        }, {
            $inc: { viewsCount: 1 }
        }, {
            returnDocument: 'after',
        }, (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Failed to read post',
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Post is not found'
                })
            }
            res.json(doc)
        })



    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed to read posts',
        })
    }
}

export const remove = async (req, res) => {

    try {
        const postId = req.params.id
        PostSchema.findOneAndDelete({
            _id: postId
        }, (err, doc) => {

            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Failed to remove post',
                })
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Post is not found'
                })
            }

            res.json({
                success: true
            })
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed to read posts',
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        await PostSchema.updateOne(
            {
                _id: postId,
            }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        res.json({
            success: true
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed to update post',
        })
    }
}