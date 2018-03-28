using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Newtonsoft.Json.Linq;
using WebHook.Models;

namespace WebHook.Controllers
{
    [Produces("application/json")]
    [Route("api/webhook")]
    public class WebhookController : Controller
    {
        [HttpGet]
        public IEnumerable<Pizza> Get() { return GetData(); }

        [HttpPost]
        [Consumes("application/json")]
        public JObject Post([FromBody] JObject data)
        {
            JToken result = data.GetValue("result");
            String action = result.Value<String>("action");

            switch (action)
            {
                case "input.welcome":
                    return JObject.FromObject(new WebHookResponse("Welcome Intent"));
                case "simpleTest":
                    StringBuilder sb = new StringBuilder();
                    sb.Append("Here is your data : \n");
                    foreach(Object o in GetData())
                        sb.Append(o.ToString() + " ");
                    return JObject.FromObject(new WebHookResponse(sb.ToString()));
                default:
                    return JObject.FromObject(new WebHookResponse("Unknown Action"));
            }
        }

        private List<Object> GetData()
        {
            List<Object> result = null;
            var client = new HttpClient();
            var task = client.GetAsync("YourDataProvider")
                .ContinueWith((taskwithresponse) =>
                {
                    var response = taskwithresponse.Result;
                    var jsonString = response.Content.ReadAsStringAsync();
                    jsonString.Wait();
                    result = JsonConvert.DeserializeObject<List<Object>>(jsonString.Result);
                });
            task.Wait();
            return result;
        }
    }
}