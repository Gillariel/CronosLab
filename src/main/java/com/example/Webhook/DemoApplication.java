package com.example.Webhook;

import com.fasterxml.classmate.GenericType;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.json.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@SpringBootApplication(scanBasePackages = "com.example.Webhook")
public class DemoApplication {
 
	@RequestMapping(value = "webhook", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
	public WebhookResponse handle(@RequestBody String data) {

		System.out.println(data);

		// Parsing Json from POST data
		JSONObject requestJson = new JSONObject(data);
		// Get the result object
		JSONObject result = requestJson.getJSONObject("result");
		// Get the action name
		String action = result.getString("action");
		System.out.println("Action received: " + action);

		// Switching on Action Name to do the correct proccess
		// DialogFlow needs to always received WebhookResponse as a response 
		switch(action) {
			// The action trigger when starting the assistant
			case "input.welcome":
				return new WebhookResponse("Hello from java webhook ! (action: " + action + ")", "Hello from java webhook ! (action: " + action + ")");
			case "simpleTest":
				return new WebhookResponse("Your speech text", "Your displayText");
			default:
				return new WebhookResponse("Unknown command received on java webhook","Unknown command received on java webhook");
		}
    }
	
	// Example of how Api Call is done with Spring
	private List<Object> APICall() {
		RestTemplate restTemplate = new RestTemplate();

		// Returning Single Object

		//ResponseEntity<Object> responseObject = restTemplate.exchange("Your_URL", HttpMethod.GET, null, Object.class);
		//return responseObject.getBody();
		
		// Or Returning a List of Object
		
		//ResponseEntity<List<Object>> responseList = restTemplate.exchange("Your_URL", HttpMethod.GET, null, new ParameterizedTypeReference<List<Object>>() {});
		//return responseObject.getBody();
		
		return null;
	}

	//Start point of a Spring App
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
