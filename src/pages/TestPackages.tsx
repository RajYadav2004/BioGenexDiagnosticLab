import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestSearch from "@/components/TestSearch";
import TestCard from "@/components/TestCard";
import CartDrawer from "@/components/CartDrawer";
import CompareDrawer from "@/components/CompareDrawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Test, TestCategory } from "@/data/testCatalog";
import { testService } from "@/services/testService";

const TestPackages = () => {
  const [catalog, setCatalog] = useState<TestCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Initial fetch from live test service
    setCatalog(testService.getTestCatalog());

    // Listen for real-time updates from admin
    const unsubscribe = testService.subscribe(() => {
      setCatalog(testService.getTestCatalog());
    });

    return unsubscribe;
  }, []);

  // Dynamically build category tabs list
  const categoryTabConfig = useMemo(() => {
    const tabs = [{ value: "all", label: "All Tests" }];
    catalog.forEach((cat, idx) => {
      // Map category name to value tab
      tabs.push({
        value: `cat-${cat.id || idx}`,
        label: cat.category,
      });
    });
    return tabs;
  }, [catalog]);

  const filterTest = (test: Test): boolean => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      test.name.toLowerCase().includes(query) ||
      test.description.toLowerCase().includes(query) ||
      (test.includes && test.includes.some((inc) => inc.toLowerCase().includes(query)))
    );
  };

  const filteredPackages = useMemo(() => {
    return catalog
      .map((cat) => ({
        ...cat,
        tests: cat.tests.filter(filterTest),
      }))
      .filter((cat) => cat.tests.length > 0);
  }, [catalog, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
                <h1 className="text-4xl md:text-5xl font-bold">
                  Health Test Packages
                </h1>
                <div className="flex gap-2">
                  <CompareDrawer />
                  <CartDrawer />
                </div>
              </div>
              <p className="text-lg opacity-90 mb-8">
                Comprehensive diagnostic packages designed for your health needs
              </p>
              <TestSearch onSearch={setSearchQuery} />
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
              <div className="flex justify-center mb-10 overflow-x-auto pb-2">
                <TabsList className="flex flex-wrap justify-center gap-1 h-auto p-1.5 bg-muted rounded-xl">
                  {categoryTabConfig.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="px-4 py-2 text-sm rounded-lg whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-foreground shadow-none"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* All Tests Tab */}
              <TabsContent value="all" className="space-y-16">
                {filteredPackages.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground">No tests found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  filteredPackages.map((category) => (
                    <div key={category.id || category.category}>
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground pb-2 border-b">
                        {category.category}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {category.tests.map((test, testIdx) => (
                          <TestCard
                            key={`${test.name}-${testIdx}`}
                            test={test}
                            delay={testIdx * 50}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              {/* Individual Category Tabs */}
              {catalog.map((cat, idx) => {
                const tabValue = `cat-${cat.id || idx}`;
                const testsToDisplay = cat.tests.filter(filterTest);

                return (
                  <TabsContent key={tabValue} value={tabValue} className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground pb-2 border-b">
                      {cat.category}
                    </h2>
                    {testsToDisplay.length === 0 ? (
                      <div className="text-center py-16">
                        <p className="text-xl text-muted-foreground">No tests found matching "{searchQuery}" in this category.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {testsToDisplay.map((test, testIdx) => (
                          <TestCard key={`${test.name}-${testIdx}`} test={test} delay={testIdx * 50} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TestPackages;