// https://www.w3.org/TR/IndexedDB

type StoreIndexData = {
  name: string
  options: {
    unique: boolean
    multiEntry: boolean
  }
}

export class IndexedDBWrapper {
  protected db!: IDBDatabase
  db_name: string
  db_version: number

  constructor(dbName: string, dbVersion: number) {
    this.db_name = dbName
    this.db_version = dbVersion
  }

  async connect() {
    // indexedDB.deleteDatabase(this.db_name) // to trigger onupgradeneeded

    this.db = await new Promise((resolve, reject) => {
      const reqConnection = indexedDB.open(this.db_name, this.db_version)

      reqConnection.onupgradeneeded = () => {
        // this onupgradeneeded eventlistener is triggered whenever there are changes on version;
        console.log("onupgradeneeded eventlistener")
      }

      reqConnection.onsuccess = () => {
        console.log("✅ Successfully connected to IndexedDB:", reqConnection.result.name);
        resolve(reqConnection.result)
      }

      reqConnection.onerror = () => {
        console.error("❌ Failed to connect to IndexedDB!");
        reject(reqConnection.error)
      }
    })
  }

  createStore(name: string) {
    this.db.createObjectStore(
      name,
      { keyPath: "id", autoIncrement: true }
    );
  }

  async createStoreIndexes(storeName: string, data: StoreIndexData[]) {
    try {
      const store = await this.getStoreInstance(storeName, "readwrite");

      data.forEach((d) => {
        const indexName = `${d.name}Index`;
        store.createIndex(indexName, d.name, d.options)
      })
    } catch (error) {
      console.error(error)
    }
  }

  getStoreInstance(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
    return new Promise((resolve) => {
      const transaction = this.db.transaction(storeName, mode);
      
      transaction.oncomplete = () => {
        const store = transaction.objectStore(storeName);
        resolve(store)
      }
      transaction.onerror = () => {
        throw new Error(`Store ${storeName} not found!`)
      }
    })
  }

  async add(storeName: string, data:any) {
      return new Promise(async (resolve) => {
        try {
          const store = await this.getStoreInstance(storeName, "readwrite")
          const request = store.add(data)
          
          request.onsuccess = () => {
            resolve("Successfully Saved!")
          }

          request.onerror = (_e) => {
            throw new Error(`Error: add function`)
          }
        } catch (error) { 
          console.error(error)
        }
      })
  }

  async delete() {}
}