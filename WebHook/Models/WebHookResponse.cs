using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebHook.Models
{
    public class WebHookResponse
    {
        public String speech { get; set; }
        public String displayText { get; set; }

        public WebHookResponse(String speech, String displayText)
        {
            this.speech = speech;
            this.displayText = displayText;
        }

        public WebHookResponse(String speechSameAsDisplayText)
        {
            this.speech = speechSameAsDisplayText;
            this.displayText = speechSameAsDisplayText;
        }
    }
}
