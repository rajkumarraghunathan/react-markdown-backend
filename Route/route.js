const express = require('express');
const Content = require('../Schema/schema');
const { isAuth } = require('./auth');


// -------------------------------------------------------------------------------------------------------------------------------------------------------//

const routes = express.Router();

// -------------------------------------------------------------------------------------------------------------------------------------------------------//

routes.post('/content', isAuth, async (req, res) => {
    try {
        const { content } = req.body;
        // console.log(content);
        if (!content) {
            return res.status(400).send({ message: "No Content" })
        }
        else {
            const data = await new Content({ userEmail: req.user.email, content });
            await data.save().then(content => {
                res.status(200).send({
                    message: "A content was Added Successfully",
                    content
                })
            }).catch(error => {
                console.log(error);
                res.status(400).send({ message: "content was already exists", error: error });
            })
        }
    } catch (error) {
        res.status(500).send({ message: " Error", error: error })
    }
})


// -------------------------------------------------------------------------------------------------------------------------------------------------------//

routes.get('/getContent', isAuth, async (req, res) => {
    try {
        await Content.find({ userEmail: req.user.email }).then(content => {
            if (!content) {
                return res.status(404).send({ message: 'No content found' })
            }
            res.status(201).send({ message: 'A new content has been retrived successfully.', content });
        }
        ).catch(error => {
            res.status(400).send({ message: "content was already exists", error: error });
        })
    } catch (error) {
        res.send(error)
    }
})


// -------------------------------------------------------------------------------------------------------------------------------------------------------//


routes.delete('/contentDelete/:contentId', isAuth, async (req, res) => {
    try {
        const { contentId } = req.params;
        await Content.findByIdAndDelete({ _id: contentId }).then(content => {
            if (!content) {
                return res.status(404).send({ message: 'No content found with the given ID' })
            }
            res.status(201).send({ message: 'A new content has been deleted successfully.', content: content });
        }
        )
            .catch(error => {
                console.log(error);
                res.status(400).send({ message: "Content  was already deleted", error: error });
            })
    } catch (error) {
        res.send(error)
    }
})

// -------------------------------------------------------------------------------------------------------------------------------------------------------//

module.exports = routes;

// -------------------------------------------------------------------------------------------------------------------------------------------------------//