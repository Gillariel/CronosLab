using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    // Récupération des données transmises
    dynamic json = await req.Content.ReadAsAsync<object>();
    var result = json.result;
    string action = result.action;

    FlowParameters parameters = FormatParameters(result);

    Response response = null;
    switch(action)
    {
        case "addToDo":
            response = await AddToDo(parameters);
            break;

        case "executedToDo":
            response = await SetTaskStatus(parameters);
            break;

        case "deleteToDo":
            response = await DeleteToDo(parameters);
            break;

        case "getAllToDo":
            response = await GetAllToDoItems(parameters);
            break;

        default:
            break;
    }

    return req.CreateResponse(HttpStatusCode.OK, response);
}

private static async Task<Response> AddToDo(FlowParameters parameters)
{
    HttpClient client = new HttpClient();
    var result = await client.PostAsJsonAsync(getFlowUrl(), parameters);
    var response = await result.Content.ReadAsAsync<Response>();

    return response;
}

private static async Task<Response> SetTaskStatus(FlowParameters parameters)
{
    HttpClient client = new HttpClient();
    var result = await client.PostAsJsonAsync(getFlowUrl(), parameters);
    var response = await result.Content.ReadAsAsync<Response>();

    return response;
}

private static async Task<Response> DeleteToDo(FlowParameters parameters)
{
    HttpClient client = new HttpClient();
    var result = await client.PostAsJsonAsync(getFlowUrl(), parameters);
    var response = await result.Content.ReadAsAsync<Response>();

    return response;
}

private static async Task<Response> GetAllToDoItems(FlowParameters parameters)
{
    HttpClient client = new HttpClient();
    var response = await client.PostAsJsonAsync(getFlowUrl(), parameters);
    var taskList = response.Content.ReadAsAsync<ToDoList>().Result;

    string msg = "Voici votre liste de tâches :";
    foreach(string task in taskList.Tasks)
    {
        msg += "\n - " + task;
    }

    return new Response
    {
        speech = msg,
        displayText = msg,
        source = "ToDoApp"
    };
}

private static FlowParameters FormatParameters(object res)
{
    dynamic result = res;
    string action = result.action;
    string title = String.IsNullOrEmpty((string)result.parameters.title) ? null : result.parameters.title;

    string priorityStr = result.parameters.priority;
    bool priority = (!String.IsNullOrEmpty(priorityStr) && priorityStr.Equals("prioritaire")) ? true : false;

    return new FlowParameters
    {
        Action = action,
        Title = title,
        Priority = priority
    } ;
}

private static String getFlowUrl()
{
    return "https://prod-63.westeurope.logic.azure.com:443/workflows/bdef29b5fb824b03bf1eec3bcba761cd/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ow9mngudqlIWm0Pb8bndolDk8dk8bTiG47L1fgCfYL0";
}

public class FlowParameters
{
    public string Action { get; set; }
    public string Title { get; set; }
    public bool Priority { get; set; } 
}

public class ToDoList
{
    public string[] Tasks { get; set; }
}

public class Response
{
    public string speech { get; set; }
    public string displayText { get; set; }
    public string source { get; set; }
}
