# ⟠ use-infinite-data ⟠

A library to get data infinite

## Installation

```
npm install @dapp-builder/use-infinite-data
yarn add @dapp-builder/use-infinite-data
```

## Example

```typescript
import { useEffect, useState } from "react";
import useInfiniteData from "use-infinite-data";

const ExampleComponent = () => {
  const [query, setQuery] = useState({});

  const { loading, items, hasMore, nextPage } = useInfiniteData(query, {
    caller: async (args) => {
      return {
        data: {
          items: [],
          total: 0,
          page: 0,
          limit: 0,
          totalPages: 0
        },
      };
    },
  });

  console.log(items, loading)
};

```