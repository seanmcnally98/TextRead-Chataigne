// Note: In order for logs to work, click on the custom module and check the box that says "log"

var filePath = "default.txt";

// Define a variable to store the previous content of the file
var previousContent = "null";

// Setting up our values
var text_value = local.values.addStringParameter("text value", "The value read from the text file", "blank");
var text_file_changed = local.values.addBoolParameter("Text File Changed","Describes whether the text file was different on the most recent check",false);

function init() {
  script.log("Custom module init");
}

script.updateRate.set(1);

// Every time that the end user changes a parameter...
function moduleParameterChanged(param) {
    if (param.is(local.parameters.textFilePath)) {
        //Update the file path if the user changed that
        filePath = local.parameters.textFilePath.get();
        script.log("File path changed to: " + local.parameters.textFilePath.get());
    }
    if (param.is(local.parameters.textFileCheckRate)) {
        //Update the check rate if the user changed that
        script.updateRate.set(local.parameters.textFileCheckRate.get());
    }
    if (param.is(local.parameters.overwriteTextFile)) {
        //Change the file's content to null if the user turned "overwrite" on
        if (local.parameters.overwriteTextFile.get() == true) {
            util.writeFile(filePath, "null", true);
            script.log("OVERWRITING FILE");
            }
        }
}

function moduleValueChanged(value) {
  script.log(value.name + " value changed, new value: " + value.get());
}


// Here we set the frequency to read the file (1 = one time per second)
script.updateRate.set(local.parameters.textFileCheckRate.get());

// this function is called every x times per second (see the updateRate value above)
function update(deltaTime) {
    // Read the content of the file
    var logContent = util.readFile(filePath, false);
    //script.log(local.parameters.overwriteTextFile.get());
    // Check if the content has changed since the last check
    if (logContent !== previousContent) {
        // Overwrite the file only if the content is different, and if we have "overwrite" checked
        if (local.parameters.overwriteTextFile.get() == true) {
            util.writeFile(filePath, "null", true);
            script.log("OVERWRITING FILE");
            }
        // Update the variable to store the new content
        previousContent = logContent;
        script.log("File content CHANGED: " + logContent);
        // Set the file content as a parameter value
        text_value.set(logContent);
        // Update our variable that tells us whether there was a change
        text_file_changed.set(true);
    } else {
         // Update our variable that tells us whether there was a change
        text_file_changed.set(false);
        // Log a message if the file content remains the same, only if verbose logging is enabled
        if (local.parameters.logEachCheck.get() == true) {
        script.log("File content was the same");
        }
    }
}