import fs from 'node:fs/promises';
import path from 'node:path';

const dataDir = path.resolve(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'dev-db.json');

const emptyDb = {
  oauthStates: {},
  connections: {},
};

async function ensureDb() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dbPath);
  } catch (err) {
    await fs.writeFile(dbPath, JSON.stringify(emptyDb, null, 2));
  }
}

export async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(dbPath, 'utf8');

  try {
    return {
      ...emptyDb,
      ...JSON.parse(raw),
    };
  } catch (err) {
    return emptyDb;
  }
}

export async function writeDb(db) {
  await ensureDb();
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
  return db;
}

export async function saveOAuthState(state, value) {
  const db = await readDb();
  db.oauthStates[state] = value;
  await writeDb(db);
}

export async function consumeOAuthState(state) {
  const db = await readDb();
  const value = db.oauthStates[state];
  delete db.oauthStates[state];
  await writeDb(db);
  return value;
}

export async function saveConnection(userId, providerId, connection) {
  const db = await readDb();
  db.connections[userId] ||= {};
  db.connections[userId][providerId] = connection;
  await writeDb(db);
  return connection;
}

export async function updateConnection(userId, providerId, patch) {
  const db = await readDb();
  const current = db.connections[userId]?.[providerId];

  if (!current) {
    return null;
  }

  db.connections[userId][providerId] = {
    ...current,
    ...patch,
  };
  await writeDb(db);
  return db.connections[userId][providerId];
}

export async function listConnections(userId) {
  const db = await readDb();
  return db.connections[userId] || {};
}

export async function deleteConnection(userId, providerId) {
  const db = await readDb();

  if (db.connections[userId]) {
    delete db.connections[userId][providerId];
  }

  await writeDb(db);
}
