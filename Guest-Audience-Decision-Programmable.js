
// Function to parse through all of a visitor's sessions and return the most recent back to calling main function.
function getLastSessionPageViews(numberOfPageViews) {
    
    // Declare an array variable to capture the most recent session data.
    var sessionPageViews = [];

    // Place all sessions into an array variable called cdpSessions.
 	var cdpSessions = guest.sessions;

 	for (var i = 0; i < cdpSessions.length; i++) {
 		// Place each session into the cdpSession array to access events within each session.
        var cdpSession = cdpSessions[i];

        // Only look sessions with type = WEB.
 		if (cdpSession.sessionType === 'WEB') {
 			// Place all of a sesssion's event data into the events array.
            var events = cdpSession.events;
            
            // Loop through all of the events found within sessions with a type of 'WEB'.
 			for (var j = 0; j < events.length; j++) {
 				var event = events[j];

 				// Look for events of type 'VIEW' which have arbitraryData and a Sitecore Template Name of 'Session'
                if (event.type === 'VIEW' && event.arbitraryData && event.arbitraryData.sitecoreTemplateName === 'Session') {
 					// If all above conditions are met, then push the event data into sessionPageViews array.
                    sessionPageViews.push(event);

 					// Logic to break out of the for loop after processing the last event with one more audiences.
                    if (sessionPageViews.length === numberOfPageViews) {
 					    break;
 					}
 				}
 			}

            // End loop after processing the latest session data. Evaluating the last session only via 'numberOfPageViews' variable set to '1'.
 			if (sessionPageViews.length === numberOfPageViews) {
 			    break;
 			}
 		}
 	}

    // Return the session page view array back to the calling main function.
    return sessionPageViews;
}

// This function is called from the main function to parse and return audiences from the most recent session.
function getAllAudiencesFromPageView(pageView) {

    // Ensure that there is at least one audience found in arbitrary data under the events section of the session data.
    if (pageView && pageView.arbitraryData && pageView.arbitraryData.audiences && pageView.arbitraryData.audiences.length > 0) {
        // If so, return all audiences as an array back to the calling function.
        return pageView.arbitraryData.audiences;
    }

    return [];
}

(function () {
    // Call the function to get an array of data associated with the last session.
    var lastSessionPageViews = getLastSessionPageViews(1);

    // Checking to make sure there is at least one item in the session array.
    if (lastSessionPageViews.length > 0) {
        // Call the function that processes the session data and looks for one or more audience(s) in a View event.
        var audiences = getAllAudiencesFromPageView(lastSessionPageViews[0]);

        // If there is an audience value, then return the first value to the decision table as a string.
        if (audiences && audiences.length > 0) {
            return audiences[0];
        }
    }

    return "";
})();