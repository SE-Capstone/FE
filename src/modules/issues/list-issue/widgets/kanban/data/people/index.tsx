/**
 * These imports are written out explicitly because they
 * need to be statically analyzable to be uploaded to CodeSandbox correctly.
 */
import Alexander from './images/processed/Alexander';

export type Person = {
  userId: string;
  name: string;
  role: string;
  avatarUrl: string;
};

const avatarMap: Record<string, string> = {
  Alexander,
};

const names: string[] = Object.keys(avatarMap);

const roles: string[] = [
  'Engineer',
  'Senior Engineer',
  'Principal Engineer',
  'Engineering Manager',
  'Designer',
  'Senior Designer',
  'Lead Designer',
  'Design Manager',
  'Content Designer',
  'Product Manager',
  'Program Manager',
];

let sharedLookupIndex = 0;

function getPersonFromPosition({ position }: { position: number }): Person {
  // use the next name
  const name = names[position % names.length];
  // use the next role
  const role = roles[position % roles.length];
  return {
    userId: `id:${position}`,
    name,
    role,
    avatarUrl: avatarMap[name],
  };
}

/**
 * Note: this does not use randomness so that it is stable for VR tests
 */
function getPerson(): Person {
  sharedLookupIndex++;
  return getPersonFromPosition({ position: sharedLookupIndex });
}

function getPeople({ amount }: { amount: number }): Person[] {
  return Array.from({ length: amount }, () => getPerson());
}

export type ColumnType = {
  title: string;
  columnId: string;
  items: Person[];
};

export type ColumnMap = { [columnId: string]: ColumnType };

export function getData({
  columnCount,
  itemsPerColumn,
}: {
  columnCount: number;
  itemsPerColumn: number;
}) {
  const columnMap: ColumnMap = {};

  for (let i = 0; i < columnCount; i++) {
    const column: ColumnType = {
      title: `Column ${i}`,
      columnId: `column-${i}`,
      items: getPeople({ amount: itemsPerColumn }),
    };
    columnMap[column.columnId] = column;
  }
  const orderedColumnIds = Object.keys(columnMap);

  return {
    columnMap,
    orderedColumnIds,
    lastOperation: null,
  };
}

export function getBasicData() {
  const columnMap: ColumnMap = {
    confluence: {
      title: 'Confluence',
      columnId: 'confluence',
      items: getPeople({ amount: 10 }),
    },
    jira: {
      title: 'Jira',
      columnId: 'jira',
      items: getPeople({ amount: 10 }),
    },
    trello: {
      title: 'Trello',
      columnId: 'trello',
      items: getPeople({ amount: 10 }),
    },
  };

  const orderedColumnIds = ['confluence', 'jira', 'trello'];

  return {
    columnMap,
    orderedColumnIds,
  };
}
