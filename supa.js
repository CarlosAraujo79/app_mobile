// Your Supabase URL
const supabaseUrl = "https://hmbdwmpbncqhisrivszm.supabase.co";

// Function to extract the hostname
function extractHostname(url) {
  let hostname;
  // Find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  // Find & remove port number
  hostname = hostname.split(":")[0];
  // Find & remove query parameters
  hostname = hostname.split("?")[0];
  return hostname;
}

// Extract the hostname
const hostname = extractHostname(supabaseUrl);
console.log(hostname); // Outputs "hmbdwmpbncqhisrivszm.supabase.co"
