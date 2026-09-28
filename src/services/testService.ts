import testCatalog, { Test, TestCategory } from "@/data/testCatalog";

const STORAGE_KEY_CUSTOM_TESTS = "biogenex_custom_tests";
const STORAGE_KEY_DELETED_TESTS = "biogenex_deleted_tests";

export interface TestInputData {
  id?: string;
  name: string;
  description: string;
  parameters: string;
  price: string;
  includes: string[];
  popular?: boolean;
  specialty?: string;
  category: string;
}

type Listener = () => void;
const listeners: Set<Listener> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("biogenex-catalog-updated"));
  }
};

// Helper to get stored custom tests
const getStoredCustomTests = (): TestInputData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CUSTOM_TESTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse custom tests from storage", e);
    return [];
  }
};

// Helper to get stored deleted test identifiers
const getStoredDeletions = (): string[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_DELETED_TESTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse deleted tests from storage", e);
    return [];
  }
};

export const testService = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getTestCatalog(): TestCategory[] {
    const customTests = getStoredCustomTests();
    const deletedTests = new Set(getStoredDeletions());

    // Deep clone initial catalog
    const catalog: TestCategory[] = JSON.parse(JSON.stringify(testCatalog));

    // Remove deleted default tests & apply edits
    catalog.forEach((cat) => {
      cat.tests = cat.tests
        .filter((t) => !deletedTests.has(`${cat.category}::${t.name}`))
        .map((t) => {
          const override = customTests.find(
            (c) => c.category === cat.category && c.name.toLowerCase() === t.name.toLowerCase()
          );
          if (override) {
            return {
              ...t,
              description: override.description,
              parameters: override.parameters,
              price: override.price,
              includes: override.includes,
              popular: override.popular,
              specialty: override.specialty,
            };
          }
          return t;
        });
    });

    // Add new tests that belong to existing categories or new categories
    customTests.forEach((custom) => {
      const catKey = `${custom.category}::${custom.name}`;
      if (deletedTests.has(catKey)) return;

      let catObj = catalog.find((c) => c.category === custom.category);

      const newTest: Test = {
        name: custom.name,
        description: custom.description,
        parameters: custom.parameters,
        price: custom.price,
        includes: custom.includes,
        popular: custom.popular,
        specialty: custom.specialty,
      };

      if (catObj) {
        const exists = catObj.tests.some(
          (t) => t.name.toLowerCase() === custom.name.toLowerCase()
        );
        if (!exists) {
          catObj.tests.unshift(newTest);
        }
      } else {
        // Create new category dynamically
        const newCat: TestCategory = {
          id: catalog.length + 1,
          category: custom.category,
          tests: [newTest],
        };
        catalog.push(newCat);
      }
    });

    return catalog;
  },

  addOrUpdateTest(data: TestInputData, originalName?: string, originalCategory?: string) {
    const customTests = getStoredCustomTests();
    const deletedTests = getStoredDeletions();

    // If test was previously deleted, un-delete it
    const targetKey = `${data.category}::${data.name}`;
    const updatedDeletions = deletedTests.filter((k) => k !== targetKey);
    localStorage.setItem(STORAGE_KEY_DELETED_TESTS, JSON.stringify(updatedDeletions));

    const existingIndex = customTests.findIndex(
      (t) =>
        (originalName ? t.name.toLowerCase() === originalName.toLowerCase() : false) ||
        (t.category === data.category && t.name.toLowerCase() === data.name.toLowerCase())
    );

    if (existingIndex >= 0) {
      customTests[existingIndex] = data;
    } else {
      customTests.push(data);
    }

    localStorage.setItem(STORAGE_KEY_CUSTOM_TESTS, JSON.stringify(customTests));
    notifyListeners();
  },

  deleteTest(testName: string, categoryName: string) {
    const customTests = getStoredCustomTests();
    const deletedTests = getStoredDeletions();

    // Remove from custom tests if present
    const updatedCustom = customTests.filter(
      (t) => !(t.category === categoryName && t.name.toLowerCase() === testName.toLowerCase())
    );
    localStorage.setItem(STORAGE_KEY_CUSTOM_TESTS, JSON.stringify(updatedCustom));

    // Record as deleted
    const deleteKey = `${categoryName}::${testName}`;
    if (!deletedTests.includes(deleteKey)) {
      deletedTests.push(deleteKey);
      localStorage.setItem(STORAGE_KEY_DELETED_TESTS, JSON.stringify(deletedTests));
    }

    notifyListeners();
  },

  resetCatalog() {
    localStorage.removeItem(STORAGE_KEY_CUSTOM_TESTS);
    localStorage.removeItem(STORAGE_KEY_DELETED_TESTS);
    notifyListeners();
  },
};
