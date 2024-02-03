import { useEffect } from "react";
import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";

// Action to create a new contact and redirect to its edit page
export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

// Loader function to retrieve contacts based on search query
export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

// Root component for the main page
export default function Root() {
  // Retrieve data from the loader
  const { contacts, q } = useLoaderData();
  
  // Hooks for navigation and form submission
  const navigation = useNavigation();
  const submit = useSubmit();
  
  // Determine if the search is in progress
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  // Set the search input value when the query changes
  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          {/* Search form */}
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>

          {/* Form for creating a new contact */}
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>

        <nav>
          {/* Display contacts in a navigation list */}
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  {/* Navigation link for each contact */}
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            // Display message when there are no contacts
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>

      <div
        id="detail"
        className={
          navigation.state === "loading" ? "loading" : ""
        }
      >
        {/* Outlet for rendering nested routes */}
        <Outlet />
      </div>
    </>
  );
}
