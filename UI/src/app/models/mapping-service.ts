import { ArrowCache, ConstantCache } from './arrow-cache';
import { groupBy } from '../infrastructure/utility';
import { MappingPair, MappingNode, Mapping } from './mapping';
import { IConnection } from '../services/bridge.service';
import { IRow } from './row';
import { ITable } from './table';

export class MappingService {
  connections: Array<IConnection>;
  constants: Array<IRow>;
  sourceTableName: string;
  targetTableName: string;

  constructor(arrowCache: ArrowCache, constants: ConstantCache, sourceTableName: string, targetTableName: string) {
    if (!arrowCache) {
      throw new Error('data should be not empty');
    }
    this.connections = Object.values(arrowCache);
    this.constants = Object.values(constants);
    this.sourceTableName = sourceTableName;
    this.targetTableName = targetTableName;
  }

  generate(): Mapping {
    const merged = this.connections
      .filter(arrow => {
        let condition = arrow.target.tableName !== 'similar';
        if (this.sourceTableName) {
          condition = condition && arrow.source.tableName === this.sourceTableName;
        }
        return condition;
      })
      .map(arrow => {
        return {
          transforms: arrow.transforms,
          sourceTable: arrow.source.tableName,
          sourceColumn: arrow.source.name,
          targetTable: arrow.target.tableName,
          targetColumn: arrow.target.name,
          lookup: arrow.lookup ? arrow.lookup['name'] : '',
          sqlTransformation: arrow.sql ? arrow.sql['name'] : '',
          comments: arrow.source.comments
        };
      });

    const bySource = groupBy(merged, 'sourceTable');

    const mapPairs: MappingPair[] = [];

    Object.keys(bySource).forEach(sourceTable => {
      if (this.sourceTableName && this.sourceTableName !== sourceTable) {
        return;
      }
      const byTargetTable = groupBy(bySource[sourceTable], 'targetTable');
      Object.keys(byTargetTable).forEach(targetTable => {
        if (this.targetTableName && this.targetTableName !== targetTable) {
          return;
        }
        const mappings = [];

        byTargetTable[targetTable].map(arrow => {
          const node: MappingNode = {
            source_field: arrow.sourceColumn,
            target_field: arrow.targetColumn,
            sql_field: arrow.sourceColumn,
            sql_alias: arrow.targetColumn,
            lookup: arrow.lookup,
            sqlTransformation: arrow.sqlTransformation,
            comments: arrow.comments
          };

          this.applyTransforms(node, arrow);

          mappings.push(node);
        });
        mapPairs.push({
          source_table: sourceTable,
          target_table: targetTable,
          mapping: mappings
        });
      });
    });

    this.applyConstant(mapPairs, this.constants);

    const mapping: Mapping = Object.create(null);
    mapping.mapping_items = mapPairs;

    return mapping;
  }

  applyTransforms(node: MappingNode, connector: any) {
    node.sql_field = connector.transforms.reduce((acc, transform) => {
      return transform.getSql(acc, transform);
    }, node.sql_field);
  }

  applyConstant(mapPairs: any[], rows: IRow[]) {
    const mappings = mapPairs.map(x => {
      return { table: x.target_table, mapping: x.mapping };
    });
    mappings.forEach((mapping: {}) => {
      rows.forEach(row => {
        if (mapping['table'] !== row.tableName) {
          return;
        }
        const constantObj = {
          source_field: '',
          sql_field: row.constant,
          sql_alias: row.name,
          target_field: row.name,
          comments: row.comments
        };
        mapping['mapping'].push(constantObj);
      });
    });
  }
}

export function addViewsToMapping(mapping: Mapping, source: ITable): Mapping {
  const sql = source['sql'];
  if (sql) {
    if (!mapping['views']) {
      mapping['views'] = {};
    }
    mapping['views'][source.name] = sql;
  }

  return mapping;
}

export function addGroupMappings(mapping: Mapping, source: ITable){

  const mappingIndex =  mapping.mapping_items.findIndex(item => item.source_table === source.name);
  let mappingItems = mapping.mapping_items[ mappingIndex ].mapping;
  const indexesToRemove = [];

  mappingItems.forEach((item, index) => {
    const field = source.rows.filter(row => row.name === item.source_field)[ 0 ];
    if (field.grouppedFields && field.grouppedFields.length) {
      const mappingsToAdd = field.grouppedFields.map(grouppedField => {
        return {
          source_field: grouppedField.name,
          target_field: item.target_field,
          sql_field: grouppedField.name,
          sql_alias: item.sql_alias,
          lookup: item.lookup,
          sqlTransformation: item.sqlTransformation,
          comments: item.comments
        };
      });

      mappingItems = mappingItems.concat(mappingsToAdd);
      indexesToRemove.push(index);
    }

  });

  while (indexesToRemove.length) {
    mappingItems.splice(indexesToRemove.pop(), 1);
  }

  mapping.mapping_items[ mappingIndex ].mapping = mappingItems;

}
