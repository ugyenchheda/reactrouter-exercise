import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

// Action function to handle contact deletion

export async function action({ params }) {
  // Simulating an intentional error for demonstration purposes
  throw new Error("oh dang!");
  await deleteContact(params.contactId);
  
  //If the previous code were to execute, it would redirect to the home page
  return redirect("/");
}