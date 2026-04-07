import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function ReviewsScreen() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const reviews = [
    { id: 1, name: 'John Doe', rating: 5, comment: 'Excellent delivery service! Very professional.', date: '2 days ago' },
    { id: 2, name: 'Jane Smith', rating: 5, comment: 'Fast and reliable. Would recommend!', date: '5 days ago' },
    { id: 3, name: 'Mike Johnson', rating: 4, comment: 'Good service, on time delivery.', date: '1 week ago' },
  ];

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#0D330E" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.gridBackground} />
      <View style={[styles.glowTop, { backgroundColor: '#A3B18A' }]} />
      <View style={[styles.glowBottom, { backgroundColor: '#2D531A' }]} />

      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.locationBadge}>
            <Icon name="map-pin" size={14} color="#2D531A" />
            <Text style={styles.locationText}>Sandton, JHB</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.mainContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D330E']} />}>
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerLeft}>
              <View style={styles.bannerLine} />
              <Text style={styles.bannerLabel}>REVIEWS</Text>
              <Text style={styles.bannerTitle}>What customers <Text style={styles.bannerName}>say</Text></Text>
            </View>
          </View>
        </View>

        <View style={styles.ratingCard}>
          <Text style={styles.ratingLabel}>Overall Rating</Text>
          <Text style={styles.ratingValue}>4.9</Text>
          <View style={styles.stars}>
            {[1,2,3,4,5].map((star) => (<Icon key={star} name="star" size={24} fill="#F59E0B" color="#F59E0B" />))}
          </View>
          <Text style={styles.ratingCount}>Based on 124 reviews</Text>
        </View>

        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewAvatar}><Text style={styles.reviewAvatarText}>{review.name.charAt(0)}</Text></View>
              <View style={styles.reviewInfo}><Text style={styles.reviewName}>{review.name}</Text>
                <View style={styles.reviewStars}>{[...Array(review.rating)].map((_, i) => (<Icon key={i} name="star" size={14} fill="#F59E0B" color="#F59E0B" />))}</View>
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D3D3D3' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#D3D3D3' },
  gridBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03 },
  glowTop: { position: 'absolute', top: 0, right: -80, width: 384, height: 384, borderRadius: 192, opacity: 0.2 },
  glowBottom: { position: 'absolute', bottom: 0, left: -80, width: 384, height: 384, borderRadius: 192, opacity: 0.1 },
  header: { position: 'absolute', top: 0, right: 0, left: 0, zIndex: 40, padding: 16, paddingTop: 48 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  locationText: { fontSize: 12, fontWeight: '900', color: '#333' },
  mainContent: { flex: 1, marginTop: 100, paddingHorizontal: 20 },
  banner: { backgroundColor: '#0D330E', borderRadius: 32, padding: 24, marginBottom: 20 },
  bannerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 },
  bannerLeft: { flex: 1, gap: 12 },
  bannerLine: { width: 40, height: 2, backgroundColor: '#A3B18A' },
  bannerLabel: { fontSize: 10, color: '#A3B18A', fontWeight: '900', letterSpacing: 3 },
  bannerTitle: { fontSize: 28, fontWeight: '300', color: 'white', lineHeight: 36 },
  bannerName: { fontWeight: '900', fontStyle: 'italic', color: '#A3B18A' },
  ratingCard: { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 32, padding: 24, alignItems: 'center', marginBottom: 20 },
  ratingLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  ratingValue: { fontSize: 48, fontWeight: 'bold', color: '#0D330E' },
  stars: { flexDirection: 'row', gap: 4, marginVertical: 12 },
  ratingCount: { fontSize: 12, color: '#999' },
  reviewCard: { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 24, padding: 20, marginBottom: 12 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  reviewAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0D330E', alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  reviewInfo: { flex: 1 },
  reviewName: { fontSize: 16, fontWeight: '600', color: '#0D330E' },
  reviewStars: { flexDirection: 'row', gap: 2, marginTop: 4 },
  reviewDate: { fontSize: 12, color: '#999' },
  reviewComment: { fontSize: 14, color: '#666', lineHeight: 20 },
});
