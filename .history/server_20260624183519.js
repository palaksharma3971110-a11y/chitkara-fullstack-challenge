const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/bfhl", (req, res) => {

    const data = req.body.data || [];

    res.json({
        user_id: "palaksharma_24082005",
        email_id: "palak1368.be23@chitkarauniversity.edu.in",
        college_roll_number: "2311981368",
        hierarchies: [],
        invalid_entries: [],
        duplicate_edges: [],
        summary: {
            total_trees: 0,
            total_cycles: 0,
            largest_tree_root: ""
        }
    });

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});