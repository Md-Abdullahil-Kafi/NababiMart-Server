import admin from "firebase-admin";
import { createPrivateKey } from "crypto";

let appInitialized = false;

const normalizePrivateKey = (privateKey = "") =>
  privateKey
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");

const getFirebaseCredential = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString(
        "utf8"
      )
    );

    return admin.credential.cert(serviceAccount);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId) {
    throw new Error("Missing Firebase project id. Set FIREBASE_PROJECT_ID.");
  }

  if (!clientEmail || !privateKey) {
    return null;
  }

  try {
    createPrivateKey(privateKey);
  } catch (error) {
    console.warn(
      "Firebase Admin private key is invalid; using project-id-only token verification."
    );
    return null;
  }

  return admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  });
};

const initFirebaseAdmin = () => {
  if (appInitialized || admin.apps.length > 0) {
    appInitialized = true;
    return admin;
  }

  const credential = getFirebaseCredential();

  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
    ...(credential ? { credential } : {}),
  });

  appInitialized = true;
  return admin;
};

export default initFirebaseAdmin;
