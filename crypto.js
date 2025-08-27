function caesarEncrypt(text, shift) {
  return text.replace(/[a-z]/gi, c => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode((c.charCodeAt(0) - base + shift) % 26 + base);
  });
}
function caesarDecrypt(text, shift) {
  return caesarEncrypt(text, (26 - shift) % 26);
}

// ROT13 Cipher (fixed shift = 13)
function rot13(text) {
  return caesarEncrypt(text, 13);
}

// XOR Cipher (with key as number or string)
function xorEncrypt(text, key) {
  if (!key) return text;

  let keyBytes = [];
  if (/^\d+$/.test(key)) {
    keyBytes = [parseInt(key)];
  } else {
    keyBytes = Array.from(key).map(ch => ch.charCodeAt(0));
  }

  const textBytes = Array.from(text).map(ch => ch.charCodeAt(0));
  const result = textBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);

  // Store in Base64 for readable output
  return btoa(String.fromCharCode(...result));
}

function xorDecrypt(base64Text, key) {
  if (!key) return base64Text;

  let keyBytes = [];
  if (/^\d+$/.test(key)) {
    keyBytes = [parseInt(key)];
  } else {
    keyBytes = Array.from(key).map(ch => ch.charCodeAt(0));
  }

  try {
    const encryptedBytes = Array.from(atob(base64Text)).map(ch => ch.charCodeAt(0));
    const result = encryptedBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
    return String.fromCharCode(...result);
  } catch {
    return "Invalid XOR ciphertext or key!";
  }
}

// Base64 Encode / Decode
function base64Encrypt(text) {
  try {
    return btoa(text);
  } catch {
    return "Invalid input for Base64!";
  }
}
function base64Decrypt(text) {
  try {
    return atob(text);
  } catch {
    return "Invalid Base64 text!";
  }
}

// DOM Elements
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const algorithm = document.getElementById("algorithm");
const shiftInput = document.getElementById("shift");
const xorKeyInput = document.getElementById("xorKey");

const caesarControls = document.getElementById("caesarControls");
const xorControls = document.getElementById("xorControls");

const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const swapBtn = document.getElementById("swapBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");

// Show relevant controls
algorithm.addEventListener("change", () => {
  caesarControls.classList.add("hidden");
  xorControls.classList.add("hidden");

  if (algorithm.value === "caesar") {
    caesarControls.classList.remove("hidden");
  } else if (algorithm.value === "xor") {
    xorControls.classList.remove("hidden");
  }
});

// Encrypt
encryptBtn.addEventListener("click", () => {
  const text = inputText.value;
  let result = "";

  switch (algorithm.value) {
    case "caesar":
      result = caesarEncrypt(text, parseInt(shiftInput.value) || 0);
      break;
    case "rot13":
      result = rot13(text);
      break;
    case "xor":
      result = xorEncrypt(text, xorKeyInput.value);
      break;
    case "base64":
      result = base64Encrypt(text);
      break;
  }
  outputText.value = result;
});

// Decrypt
decryptBtn.addEventListener("click", () => {
  const text = inputText.value;
  let result = "";

  switch (algorithm.value) {
    case "caesar":
      result = caesarDecrypt(text, parseInt(shiftInput.value) || 0);
      break;
    case "rot13":
      result = rot13(text); // same as encrypt
      break;
    case "xor":
      result = xorDecrypt(text, xorKeyInput.value);
      break;
    case "base64":
      result = base64Decrypt(text);
      break;
  }
  outputText.value = result;
});

// Swap input/output
swapBtn.addEventListener("click", () => {
  inputText.value = outputText.value;
  outputText.value = "";
});

// Copy Output
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(outputText.value);
  alert("Output copied!");
});

// Download Output
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([outputText.value], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "crypto_output.txt";
  link.click();
});

// Clear
clearBtn.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
});
