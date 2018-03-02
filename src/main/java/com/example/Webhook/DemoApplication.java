package com.example.Webhook;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.json.*;

@RestController
@SpringBootApplication(scanBasePackages = "com.example.Webhook")
public class DemoApplication {
 
	@RequestMapping(value = "webhook", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
	public Response webhook(@RequestBody String data) {

		// Connection to MongoDatabase
		MongoClient mongoClient = getDatabaseConnection();
		MongoDatabase db = mongoClient.getDatabase("pizza-shop-DB");

		JSONObject requestJson = new JSONObject(data);
		// Retrieve useful parameters from POST data
		JSONObject result = requestJson.getJSONObject("result");
		JSONObject parameters = result.getJSONObject("parameters");
		String action = result.getString("action");

		Response response;
		switch(action) {
			case "orderPizza":
				response = addNewOrder(db, result.getJSONArray("contexts"));
				break;

			case "getPizzaList":
				response = getAllPizza(db);
				break;

			case "addFavoritePizza":
				response = addFavoritePizza(db, parameters.getString("pizza"));
				break;

			default:
				response = new Response("Je ne comprends pas votre requête");
		}
		return response;
	}

	public Response addNewOrder(MongoDatabase db, JSONArray contextsArray) {

		// In this case, we only have one context coming from dialogflow
		JSONObject orderContext = contextsArray.getJSONObject(0);
		// Get parameters from this context
		JSONObject parameters = orderContext.getJSONObject("parameters");
		// Retrieve data
		String name = parameters.getString("name");
		String pizza = parameters.getString("pizza");
		String city = parameters.getString("city");
		String street = parameters.getString("street");
		String zipCode = parameters.getString("zip-code");

		// Check if the favorite pizza is known
		if(pizza.equals("favorite")) {
			pizza = getFavoritePizza(db);
			if(pizza == null) {
				return new Response("Je ne connais pas encore votre pizza favorite... Veuillez l'ajouter !");
			}
		}

		// Create a new document containing the order
		Document document = new Document("customer", name)
			.append("pizza", pizza)
			.append("city", city)
			.append("street", street)
			.append("code", zipCode);

		// Get orders collection
		MongoCollection<Document> collection = db.getCollection("order");
		// Insert the new order into database
		collection.insertOne(document);

		return new Response(name + ", votre pizza '" + pizza + "' sera livrée dans les plus brefs délais à " + street + " (" + zipCode + " " + city + ")");
	}

	public Response getAllPizza(MongoDatabase db) {

		MongoCollection<Document> collection = db.getCollection("pizza");

		String message = "Voici la liste des pizzas :";
		MongoCursor<Document> iterator = collection.find().iterator();
		while(iterator.hasNext()) {
			Document doc = iterator.next();
			message += "\n - " +doc.getString("name") + " (" + doc.getDouble("price") + "€)";
		}
		return new Response(message);
	}

	public Response addFavoritePizza(MongoDatabase db, String pizza) {
		// Drop old preference
		db.getCollection("preference").drop();
		// Create a new preference
		MongoCollection<Document> collection = db.getCollection("preference");
		Document document = new Document("pizza", pizza);
		// Insert the new preference into database
		collection.insertOne(document);

		return new Response("Compris ! Je retiens que la pizza '" + pizza + "' est votre préférée !");
	}

	private String getFavoritePizza(MongoDatabase db) {

		MongoCollection<Document> collection = db.getCollection("preference");
		
		String favoritePizza = null;
		if(collection.count() != 0) {
			MongoCursor<Document> iterator = collection.find().iterator();
			Document doc = iterator.next();
			favoritePizza = doc.getString("pizza");
		}
		return favoritePizza;
	}

	public MongoClient getDatabaseConnection() {
		MongoClientURI uri = new MongoClientURI("mongodb://suli94:suli1994@pizzashop-db-shard-00-00-g0r5a.mongodb.net:27017,pizzashop-db-shard-00-01-g0r5a.mongodb.net:27017,pizzashop-db-shard-00-02-g0r5a.mongodb.net:27017/test?ssl=true&replicaSet=PizzaSHop-DB-shard-0&authSource=admin");
		return new MongoClient(uri);
	}
	
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
