// mobile/src/screens/FavoritesScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const FavoritesScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    // Simulate loading - replace with actual API call
    setTimeout(() => {
      setFavorites([
        {
          id: 1,
          name: 'Sarah J.',
          image: '',
          rating: 4.9,
          jobs: 1247,
          city: 'Johannesburg',
          bio: 'Experienced runner with 5+ years of delivery experience',
        },
        {
          id: 2,
          name: 'Michael C.',
          image: '',
          rating: 4.8,
          jobs: 892,
          city: 'Johannesburg',
          bio: 'Tech enthusiast specializing in electronics deliveries',
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2D531A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favorites</Text>
          <View style={{ width: 40 }} />
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>Save your favorite runners for quick booking</Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigation.navigate('UserHome')}
            >
              <Text style={styles.browseButtonText}>Browse Runners</Text>
            </TouchableOpacity>
          </View>
        ) : (
          favorites.map((favorite) => (
            <TouchableOpacity
              key={favorite.id}
              style={styles.favoriteCard}
              onPress={() => navigation.navigate('RunnerDetails', { runnerId: favorite.id })}
            >
              <View style={styles.cardContent}>
                <View style={styles.avatar}>
                  {favorite.image ? (
                    <Image source={{ uri: favorite.image }} style={styles.avatarImage} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>{favorite.name.charAt(0)}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.info}>
                  <Text style={styles.name}>{favorite.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FBBF24" />
                    <Text style={styles.rating}>{favorite.rating}</Text>
                    <Text style={styles.jobs}>• {favorite.jobs} jobs</Text>
                  </View>
                  <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={12} color="#6B7280" />
                    <Text style={styles.location}>{favorite.city}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeFavorite(favorite.id)}
                >
                  <Ionicons name="heart" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  browseButton: {
    backgroundColor: '#2D531A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  favoriteCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2D531A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
  },
  jobs: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  removeButton: {
    padding: 8,
  },
});

export default FavoritesScreen;