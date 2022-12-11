// 对树的子节点名称进行排序
const compareTreeName = (a, b) => {
    const alen = a.length,
      blen = b.length;
    const len = alen > blen ? blen : alen;
    for (let i = 0; i < len; i++) {
      if (a[i] > b[i]) {
        return 1;
      }
      if (a[i] < b[i]) {
        return -1;
      }
    }
    return alen - blen;
  };
// 设备分隔

const getMatchedName = (periodName, periodSplit) => {
    const periodNames = [];
    const splits = [];
    let matchName = '';
    let matchSplit = '';
    const periodSplitMap = periodSplit.reduce((prev, split) => {
      prev[split] = true;
      return prev;
    }, {});
    for (let i = 0; i < periodName.length; i++) {
      if (periodSplitMap[periodName[i]] === true) {
        matchSplit += periodName[i];
        if (matchName) {
          periodNames.push(matchName);
          matchName = '';
        }
        if (i === periodName.length - 1) {
          splits.push(matchSplit);
        }
      } else {
        matchName += periodName[i];
        if (matchSplit) {
          splits.push(matchSplit);
          matchSplit = '';
        }
        if (i === periodName.length - 1) {
          periodNames.push(matchName);
        }
      }
    }
    return { periodNames, splits };
  };
  // 根据树节点分割树
  const generateTree = ({
    list = [],
    nameKey = 'title',
    childrenKey = 'children',
    parentKey = '',
    parentSplit = '',
    sortable = true,
  }) => {
    if (!list || !list.length) return [];
  
    const rootNameMap = {};
    list.forEach(v => {
      const { periodNames, splits, _id } = v;
      const [nodeName, ...restNames] = periodNames;
  
      const _key = parentKey ? `${parentKey}${parentSplit}` : '';
      // 叶子节点
      if (nodeName === undefined) {
        return;
      } else {
        const [fisrtSplit, ...restSplits] = splits;
        const _splitChar = fisrtSplit || '';
        const _name = `${_key}${nodeName}`;
        const item = {
          splits: restSplits || [],
          periodNames: restNames,
          _id,
        };
        // 存储到map方便后面聚合
        if (rootNameMap[_name]) {
          rootNameMap[_name].list.push(item);
        } else {
          rootNameMap[_name] = {};
          rootNameMap[_name].name = nodeName;
          rootNameMap[_name].splitChar = _splitChar || '';
          rootNameMap[_name].list = [item];
          rootNameMap[_name]._id = _id;
        }
      }
    });
    const res = Object.keys(rootNameMap).map(k => {
      return {
        key: k,
        splitChar: rootNameMap[k].splitChar,
        [nameKey]: rootNameMap[k].name,
        _id: rootNameMap[k]._id,
        [childrenKey]: generateTree({
          list: rootNameMap[k].list,
          parentKey: k,
          parentSplit: rootNameMap[k].splitChar,
          sortable,
        }),
      };
    });
    if (sortable) {
      res.sort((node1, node2) => compareTreeName(node1[nameKey], node2[nameKey]));
    }
    return res;
  };
  const splitName = ({ list = [], periodSplit = [] }) => {
    if (!list || !list.length) return [];
    const _result = list.map((_name, index) => {
      const periodName = _name;
      const { periodNames, splits } = getMatchedName(periodName, periodSplit);
      return {
        // 正则分割
        periodNames: periodSplit.length ? periodNames : periodName ? [periodName] : [],
        // 记录分隔符
        splits: splits,
      };
    });
    return _result;
  };
  // 根据分隔符将列表分隔为树
  export const splitList2Tree = ({
    list = [],
    nameKey = 'title',
    childrenKey = 'children',
    periodSplit = ['.', '_'],
    sortable = true,
  }) => {
    if(!list || !list.length) return []

    const time = performance.now()

    const nameList = splitName({
      list,
      periodSplit,
    });
  
    const tree = generateTree({ list: nameList, nameKey, childrenKey, sortable });

    console.log(`${performance.now() - time}ms`)
    return tree;
  };
  

  // 字符串列表格式化为树
export const list2Tree = ({
    list,
    nameKey = 'title',
    sortable = true,
  }) => {
    const res = list.map((v, index) => ({
      [nameKey]: v,
      key: v,
    }));
    if (sortable) {
      return res.sort((node1, node2) => compareTreeName(node1[nameKey], node2[nameKey]));
    }
    return res;
  };

  export const getKeyBoolMap = (keys = []) => {
    const map = {};
    keys.forEach(k => {
      map[k] = true;
    });
    return map;
  };
  export const getTreeNodeByKey = ({ tree = [], keys = [], childrenKey = 'children' }) => {
    if (!tree || !tree.length) return [];
    const keyMap = {};
    const keysMap = getKeyBoolMap(keys);
  
    const loop = tree => {
      if (!tree || !tree.length) return;
      tree.forEach(v => {
        if (keysMap[v.key]) {
          keyMap[v.key] = v;
        } else if (v[childrenKey]) {
          loop(v[childrenKey]);
        }
      });
    };
    loop(tree);
  
    return Object.keys(keyMap).map(k => keyMap[k]);
  };
  export const getTreeChildKeysByKey = ({ list = [], keys = [], childrenKey = 'children' }) => {
    if (!list || !list.length) return {};
    const nodes = getTreeNodeByKey({ tree: list, keys, childrenKey });
    const childKeys = [];
    const leafKeys = [];
    const loop = tree => {
      if (!tree || !tree.length) return;
      tree.forEach(v => {
        childKeys.push(v.key);
        if (!v[childrenKey] || v[childrenKey].length === 0) {
          leafKeys.push(v.key);
        }
        if (v[childrenKey]) {
          loop(v[childrenKey]);
        }
      });
    };
    loop(nodes);
    return { childKeys, leafKeys };
  };