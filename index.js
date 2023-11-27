import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";

const _dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.set('view engine', 'ejs');


mongoose.connect("mongodb+srv://vinitjoshiofficial:Vinit_joshi04@cluster0.sp0xlhb.mongodb.net/?retryWrites=true&w=majority");

const categorySchema = new mongoose.Schema({
    categories: [String],
    items: [String],
    belongsTo: [String]
});

const clozeSchema = new mongoose.Schema({
    paragraph: String,
    options: [String],
    preview: String
})

const comprehensionSchema = new mongoose.Schema({
    passage: String,
    questions: [String],
    options: [[String]]
})

const Category = new mongoose.model("Category" , categorySchema);

const Cloze = new mongoose.model("Cloze" , clozeSchema);

const Comprehension = new mongoose.model("Comprehension" , comprehensionSchema);

app.get("/" , (req , res)=>{
    res.sendFile(_dirname + "/public/index.html");
})

app.get("/cloze" , (req , res)=>{
    res.sendFile(_dirname + "/public/cloze.html");

})

app.get("/comprehension" , (req , res)=>{
    res.sendFile(_dirname + "/public/comprehension.html");

})

app.get("/preview" , async (req , res)=>{
    const categories = await Category.find();  
    const clozes = await Cloze.find();
    const comprehensions = await Comprehension.find();

    res.render("preview.ejs" , {categories , clozes , comprehensions});  
})

app.post("/" , async (req , res)=>{
    // console.log(req.body);

    // Delete all existing data
    await Category.deleteMany({}); 

    const categoriesName = req.body.categories;
    const itemsName = req.body.items;
    const itemsBelongsTo = req.body.belongsto;

    const newCategory = new Category({
        categories: categoriesName,
        items: itemsName,
        belongsTo: itemsBelongsTo
    });

    await newCategory.save();
    res.redirect("/cloze");
})

app.post("/cloze" , async (req , res)=>{
    // console.log(req.body);

    await Cloze.deleteMany({});

    const paragraph = req.body.Paragraph;
    const underlineWords = JSON.parse(req.body.UnderlinedWords);
    const options = JSON.parse(req.body.Options);
    const preview = req.body.Preview;

    const mergedOptions = underlineWords.concat(options);
    // console.log(mergedOptions);

    const newCloze = new Cloze({
        paragraph: paragraph,
        options: mergedOptions,
        preview: preview
    });

    await newCloze.save();
    res.redirect("/comprehension");

});

app.post("/comprehension" , async (req , res)=>{
    // console.log(req.body);

    await Comprehension.deleteMany({});

    const passage = req.body.Passage;
    const questions = req.body.Questions;
    const options = JSON.parse(req.body.OptionsText);
    // console.log(questions);


    const newComprehension = new Comprehension({
        passage: passage,
        questions: questions,
        options: options
    });

    await newComprehension.save();
    res.redirect("/preview");
});

app.listen(port , () => {
    console.log(`Server running on port ${port}`);
}); 