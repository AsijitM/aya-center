const admin = require('firebase-admin');
const serviceAccount = require('./config/aya-center-firebase-adminsdk-htn2n-3d367cf2e0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://users.firebaseio.com',
});

const firestore = admin.firestore();
const auth = admin.auth();

const seedSuperAdmin = async () => {
  const email = 'admin@aya.com';
  const password = 'password';

  try {
    // Create Firebase Authentication user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: 'Super Admin',
    });

    // Add user details to Firestore
    await firestore.collection('users').doc(userRecord.uid).set({
      name: 'Super Admin',
      email: email,
      role: 'superadmin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('Super admin seeded successfully');
  } catch (error) {
    console.error('Error seeding super admin:', error);
  }
};

seedSuperAdmin();
