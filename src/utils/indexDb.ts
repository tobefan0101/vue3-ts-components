// 只有版本变更时才会触发onupgradeneeded，创建表必须在该生命周期
const openDbUpGrade = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("dbName");
    request.onupgradeneeded = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    request.onerror = reject;
  });
};
// 查询数据 插入数据 必须在success之后才可
const openDbSuccess = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("dbName");
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    request.onerror = reject;
  });
};
export const delDatabase = async (id: number) => {
  window.indexedDB.deleteDatabase("dbName");
};
export const saveTableData = async (data: Record<string, any>, id: string) => {
  const db = (await openDbUpGrade()) as IDBDatabase;
  return new Promise((resolve) => {
    const tableCursor_img = db.createObjectStore("tableName");
    tableCursor_img.put("value", "key");
    db.close();
    resolve("success");
  });
};
/**
 * 获取当前表格的所有数据
 * @param tableName
 */
export const getTableAllData = async (tableName: string) => {
  const db = (await openDbSuccess()) as IDBDatabase;
  return new Promise((resolve, reject) => {
    try {
      const store = db
        .transaction(tableName, "readwrite")
        .objectStore(tableName);
      const rq = store.getAllKeys();
      rq.onsuccess = () => {
        const rq2 = store.getAll();
        rq2.onsuccess = () => {
          const keys = rq.result;
          const values = rq2.result;
          const res = {};
          for (let i = 0; i < keys.length; i++) {
            Reflect.set(res, keys[i] as string, values[i]);
          }
          resolve(res);
        };
      };
      rq.onerror = reject;
    } catch (err) {
      resolve({});
    }
  });
};
/**
 * 获取表格数据
 * @param params
 */
export const getTableData = async (params: {
  tableName: string;
  key: string;
  cache?: boolean;
  fn: (res: any) => void;
}) => {
  const id = params.cache ? "cache" : "";
  const db = (await openDbSuccess(id)) as IDBDatabase;
  try {
    const store = db
      .transaction(params.tableName, "readwrite")
      .objectStore(params.tableName);
    const rq = store.get(params.key);
    rq.onsuccess = () => {
      params.fn(rq.result);
    };
  } catch (err) {
    params.fn({});
  }
};

/**
 * 更新表格数据
 * @param params
 */
export const updateTableData = async (params: {
  tableName: string;
  key: string;
  value: any;
  fn?: (res: any) => void;
}) => {
  const db = (await openDbSuccess()) as IDBDatabase;
  const store = db
    .transaction(params.tableName, "readwrite")
    .objectStore(params.tableName);
  const rq = store.put(params.value, params.key);
  rq.onsuccess = (event) => {
    if (params.fn) params.fn(event);
    return "success";
  };
  rq.onerror = (event) => {
    if (params.fn) params.fn(event);
    throw "error";
  };
};

export const clearTableData = async (tableName: string) => {
  const db = (await openDbSuccess()) as IDBDatabase;
  ["_xml", "_xml_new", "_img", "_img_new", "_img_color", "_img_comb"].forEach(
    (ex) => {
      const store = db
        .transaction(tableName + ex, "readwrite")
        .objectStore(tableName + ex);
      store.clear();
    }
  );

  return "success";
};