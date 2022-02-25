## Middleware Process
1. verify the token to check if user is valid, and to get the user's old email
2. create the empty file array to push path later on
3. call the multer middleware to convert file data to json and to append to the request body and to store the image in a temp folder
4. validate the request body with zod
   if the request body is invalidated abort the request, respond with 400 and delete the image in the temp folder 
5. if the request contains and email (the user's new email), check if that email already exists in the database.
   if the email does exist abort the request, respond with 400 and delete the image in the temp folder.
6. request has been validated, so create the new jwt token using the new email in the request body and store it in as a local response variable

*****************************************************************************************************************

## Handler Process
1. find and store the user's old info using the request param id
2. check if the email from the decoded token is the same one as the one in user's old info 
   - (essentially check if the person trying the edit the info is the owner of that info)
   - if they're not throw and error aborting the request and delete the image in the temp folder
3. if the request contains an email/password etc. process it and store in variable
4. if the request contains an image
   - move the image from the temp folder and overwrite the existing image in the profile folder
   - no need to update file profilePhoto since the file name and location is going to be the same
5. Once processes are complete respond with updated data and new jwt token
