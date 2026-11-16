import express from "express";
import fs from "fs";
const app = express();
app.use(express.json());
const readData = () => {
    const data = fs.readFileSync("./data/faculty.json", "utf-8");
    return JSON.parse(data);
};
const writeData = (data) => {
    fs.writeFileSync(
        "./data/faculty.json",
        JSON.stringify(data, null, 2)
    );
};
app.post("/api/v1/faculty", (req, res) => {
    const allFaculty = readData();
    const newFaculty = {
        id: allFaculty.length > 0
            ? Math.max(...allFaculty.map(f => f.id)) + 1
            : 1,
        ...req.body
    };
    allFaculty.push(newFaculty);
    writeData(allFaculty);
    res.status(201).json({
        message: " new Faculty created successfully",
        data: newFaculty
    });
});
app.get("/api/v1/faculty", (req, res) => {
    const allFaculty = readData();
    res.status(200).json({
        message: "All Faculty fetched successfully",
        data: allFaculty
    });
});
app.get("/api/v1/faculty/:id", (req, res) => {
    const facultyId = parseInt(req.params.id);
    const allFaculty = readData();
    const faculty = allFaculty.find(fac=> fac.id===facultyId);
    if(faculty) {
        res.status(200).json({
            message: "Faculty details fetched successfully",
            data: faculty
        });
    } else {
        res.status(404).json({
            message: "Faculty not found"
        });
    }
});
app.put("/api/v1/faculty/:id", (req, res) => {
    const facultyId = parseInt(req.params.id);
    const allFaculty = readData();
    const facultyIndex = allFaculty.findIndex( (f) => f.id === facultyId);
    if (facultyIndex !== -1) {
        const updatedFaculty = {
            ...allFaculty[facultyIndex],
            ...req.body
        };
        allFaculty[facultyIndex] = updatedFaculty;
        writeData(allFaculty);
        res.status(200).json({
            message: "Faculty updated successfully",
            data: updatedFaculty
        });
    } else {
        res.status(404).json({
            message: "Faculty not found"
        });
    }
});
app.delete("/api/v1/faculty/:id", (req, res) => {
    const facultyId = parseInt(req.params.id);
    const allFaculty = readData();
    const facultyIndex = allFaculty.findIndex( (f) => f.id === facultyId);
    if (facultyIndex !== -1) {
        const deletedFaculty = allFaculty.splice(facultyIndex, 1)[0];
        writeData(allFaculty);
        res.status(200).json({
            message: "Faculty deleted successfully",
            data: deletedFaculty
        });
    } else {
        res.status(404).json({
            message: "Faculty not found"
        });
    }
});
app.listen(process.env.PORT || 8080, () => {
    console.log("Server is running at http://localhost:8080/api/v1/faculty");
});
