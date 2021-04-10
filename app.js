let http =  require("http");
let url = require("url");
let fs = require("fs");
let port = 9999;
let tasks = new Array();
let htmlData = `
        <div>
            <h2 style="text-decoration:underline; text-align: center;">Task Planner</h2>
            <h3 style="text-decoration: underline;">Task Data</h3>
            <form>
                <label>Employee ID: </label>
                <input type="text" name="empId"/><br/>
                <label>Task ID: </label>
                <input type="text" name="taskId"/><br/>
                <label>Task Name: </label>
                <input type="text" name="taskName"/><br/>
                <label>Deadline: </label>
                <input type="date" name="deadline"/><br/>
                <input type="submit" value="Add Task"/>
                <input type="reset" value="Reset Form"/>
            </form>
        </div>

        <div>
        <h3 style="text-decoration: underline;">Delete Task</h3>
        <form>
            <label>Task ID: </label>
            <input type="text" name="deletedTask"/><br/>
            <input type="submit" value="Delete Task"/>
        </form>
    </div>

    <div>
        <h3 style="text-decoration: underline;">List Tasks</h3>
        <input type="button" value="List Tasks"/>
    </div>
    <table>
    <thead>
        <tr>
            <td>Employee ID</td>
            <td>Task ID</td>
            <td>Task Name</td>
            <td>Deadline</td>
        </tr>
    </thead>
    <tbody>
`;
let server = http.createServer((req, res) => {
    console.log(req.url);
    res.setHeader("content-type", "text/html");
//    if(req.url != "/favicon.ico") {
        if(req.url == "/store") {
            //take the value from url
            let data = url.parse(urlDetails, true).query;
            //convert to object
            let task = {
                empId: data.empId,
                taskId: data.taskId,
                taskName: data.taskName,
                deadline: data.deadline
            };
            //store records in object using push method
            tasks.push(task);
            //convert to string
            let jsonData = JSON.stringify(tasks);
            //store using fs module
            fs.writeFile("tasks.json", jsonData);
            res.end(htmlData);
        }
        else if (req.url == "/delete") {
            //read from file
            let jsonRes = fs.readFile("tasks.json");
            //convert to json
            let parsedJson = jsonRes.parse(jsonRes);
            let data = url.parse(urlDetails, true).query;
            //check value using iterator or loop
            for (let i=0; i < parsedJson.length; i++) {
                //delete using array methods
                if (parsedJson.taskId == data.taskId) {
                    parsedJson.splice(i, 1);
                    //store in file using fs module
                    fs.writeFile("tasks.json", parsedJson);
                    res.end("Task deleted successfully");
                }
                //if task id is not available display error message
                else {
                    res.end("Error! Task ID not found!");
                }
            }
            res.end(htmlData);
        }
        else if (req.url == "/display") {
            //read from file
            let jsonRes = fs.readFile("tasks.json");
            //convert to json
            let parsedJson = JSON.parse(jsonRes);
            //iterator loop
            for (let i = 0; i < parsedJson.length; i++) {
                let task = parsedJson[i];
                //create tableData variable using backticks
                htmlData += `
                <tr>
                    <td>${task.empId}</td>
                    <td>${task.taskId}</td>
                    <td>${task.taskName}</td>
                    <td>${task.date}</td>
                </tr>
                `
            }
           htmlData += `
           </tbody>
        </table>
           `
           res.end(htmlData);
        }
//    }
});


server.listen(port, () => console.log(`Server is listening on port number ${port}`));
