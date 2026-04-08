import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Runner {
  id: string;
  name: string;
  rating: number;
  deliveryCount: number;
  price: number;
  image: string;
  distance: string;
}

export default function ExploreScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Nearby', 'Top Rated', 'Fastest', 'Budget'];

  useEffect(() => {
    fetchRunners();
  }, []);

  const fetchRunners = async () => {
    try {
      // Mock data - replace with your actual API call
      setTimeout(() => {
        const mockRunners = [
          {
            id: '1',
            name: 'John Doe',
            rating: 4.8,
            deliveryCount: 342,
            price: 25,
            image: 'https://via.placeholder.com/100',
            distance: '0.5 km',
          },
          {
            id: '2',
            name: 'Jane Smith',
            rating: 4.9,
            deliveryCount: 512,
            price: 30,
            image: 'https://via.placeholder.com/100',
            distance: '0.8 km',
          },
          {
            id: '3',
            name: 'Mike Johnson',
            rating: 4.7,
            deliveryCount: 278,
            price: 20,
            image: 'https://via.placeholder.com/100',
            distance: '1.2 km',
          },
          {
            id: '4',
            name: 'Sarah Williams',
            rating: 5.0,
            deliveryCount: 689,
            price: 35,
            image: 'https://via.placeholder.com/100',
            distance: '0.3 km',
          },
          {
            id: '5',
            name: 'David Brown',
            rating: 4.6,
            deliveryCount: 156,
            price: 22,
            image: 'https://via.placeholder.com/100',
            distance: '1.5 km',
          },
          {
            id: '6',
            name: 'Emily Davis',
            rating: 4.9,
            deliveryCount: 423,
            price: 28,
            image: 'https://via.placeholder.com/100',
            distance: '0.7 km',
          },
        ];
        setRunners(mockRunners);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching runners:', error);
      setLoading(false);
    }
  };

  const filteredRunners = runners.filter(runner => 
    runner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRunnerCard = ({ item }: { item: Runner }) => (
    <TouchableOpacity 
      style={styles.runnerCard}
      onPress={() => navigation.navigate('RunnerDetails', { runnerId: item.id })}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.runnerImage}
      />
      <View style={styles.runnerInfo}>
        <Text style={styles.runnerName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.deliveryCount}>• {item.deliveryCount} deliveries</Text>
        </View>
        <Text style={styles.distance}>📍 {item.distance} away</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>R{item.price}</Text>
        <Text style={styles.priceLabel}>per delivery</Text>
      </View>
    </TouchableOpacity>
  );

  const CategoryButton = ({ title }: { title: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === title && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(title)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === title && styles.categoryTextActive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Finding runners near you...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Runners</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
          <Text style={styles.favoritesIcon}>❤️</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search runners by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        data={categories}
        renderItem={({ item }) => <CategoryButton title={item} />}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
        contentContainerStyle={styles.categoriesContent}
      />

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredRunners.length} runners available
        </Text>
      </View>

      {/* Runners List */}
      <FlatList
        data={filteredRunners}
        renderItem={renderRunnerCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.runnersList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  favoritesIcon: {
    fontSize: 24,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  categoriesList: {
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  categoriesContent: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 1,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  runnersList: {
    padding: 15,
  },
  runnerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  runnerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
  },
  runnerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  runnerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#f39c12',
    marginRight: 8,
  },
  deliveryCount: {
    fontSize: 12,
    color: '#666',
  },
  distance: {
    fontSize: 12,
    color: '#666',
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  priceLabel: {
    fontSize: 11,
    color: '#666',
  },
});