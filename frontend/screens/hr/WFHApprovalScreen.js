import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';

import {
  approveWFHRequest,
  getAllWFHRequests,
  rejectWFHRequest,
} from '../../services/wfhService';

export default function WFHApprovalScreen() {

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);
   const [search, setSearch] =
  useState('');

    const [filteredRequests,
        setFilteredRequests] =
        useState([]); 

  useEffect(() => {

    loadRequests();

  }, []);

  const loadRequests = async () => {

    try {

      const response =
        await getAllWFHRequests();

      if (!response?.success) {
        throw new Error(
          response?.message ||
          'Failed to load WFH requests'
        );
      }

        const data =
            response?.requests || [];

        setRequests(data);

        setFilteredRequests(data);
    } catch (error) {

      console.log(
        'WFH LOAD ERROR:',
        error?.message
      );

      Alert.alert(
        'Error',
        error?.message ||
        'Failed to load WFH requests'
      );

    } finally {

      setLoading(false);
      setRefreshing(false);
    }
  };

  const approveRequest =
    async (id) => {

      try {

        const response =
          await approveWFHRequest(
            id
          );

        if (!response?.success) {
          throw new Error(
            response?.message ||
            'Approval Failed'
          );
        }

        setRequests(
          (items) =>
            items.map((item) =>
              item._id === id ||
              item.id === id
                ? {
                  ...item,
                  status: 'approved',
                }
                : item
            )
        );

        Alert.alert(
          'Success',
          'WFH Approved'
        );

      } catch (error) {

        Alert.alert(
          'Error',
          error?.message ||
          'Approval Failed'
        );
      }
    };

  const rejectRequest =
    async (id) => {

      try {

        const response =
          await rejectWFHRequest(
            id
          );

        if (!response?.success) {
          throw new Error(
            response?.message ||
            'Rejection Failed'
          );
        }

        setRequests(
          (items) =>
            items.map((item) =>
              item._id === id ||
              item.id === id
                ? {
                  ...item,
                  status: 'rejected',
                }
                : item
            )
        );

        Alert.alert(
          'Success',
          'WFH Rejected'
        );

      } catch (error) {

        Alert.alert(
          'Error',
          error?.message ||
          'Rejection Failed'
        );
      }
    };

  const onRefresh =
    async () => {

      setRefreshing(true);

      await loadRequests();
    };
    const handleSearch =
        (text) => {

            setSearch(text);

            const filtered =
                requests.filter(
                    item =>

                        item.employee_name
                            ?.toLowerCase()
                            .includes(
                                text.toLowerCase()
                            ) ||

                        item.reason
                            ?.toLowerCase()
                            .includes(
                                text.toLowerCase()
                            ) ||

                        item.status
                            ?.toLowerCase()
                            .includes(
                                text.toLowerCase()
                            )
                );

            setFilteredRequests(
                filtered
            );
        };

  const renderItem =
    ({ item }) => {

      const status =
        String(
          item.status ||
          'pending'
        ).toLowerCase();

      const statusLabel =
        status
          ? status[0].toUpperCase() +
            status.slice(1)
          : 'Pending';

      return (

      <View style={styles.card}>

        <Text style={styles.name}>
          {item.employee_name}
        </Text>

        <Text style={styles.info}>
          Start:
          {' '}
          {item.start_date}
        </Text>

        <Text style={styles.info}>
          End:
          {' '}
          {item.end_date}
        </Text>

        <Text style={styles.info}>
          Type:
          {' '}
          {item.wfh_type}
        </Text>

        <Text style={styles.reason}>
          {item.reason}
        </Text>

        <Text
          style={[
            styles.status,
            {
              color:
                status ===
                'approved'
                  ? 'green'
                  : status ===
                    'rejected'
                  ? 'red'
                  : 'orange',
            },
          ]}
        >
          {statusLabel}
        </Text>

        {
          status ===
            'pending' && (
            <View
              style={
                styles.buttonRow
              }
            >

              <TouchableOpacity
                style={
                  styles.approveBtn
                }
                onPress={() =>
                  approveRequest(
                    item._id
                  )
                }
              >
                <Text
                  style={
                    styles.btnText
                  }
                >
                  Approve
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.rejectBtn
                }
                onPress={() =>
                  rejectRequest(
                    item._id
                  )
                }
              >
                <Text
                  style={
                    styles.btnText
                  }
                >
                  Reject
                </Text>
              </TouchableOpacity>

            </View>
          )
        }

      </View>
      );
    };

  if (loading) {

    return (

      <View
        style={
          styles.loadingContainer
        }
      >

        <ActivityIndicator
          size="large"
        />

      </View>
    );
  }

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        WFH Approval
      
          </Text>
          <TextInput
              value={search}
              onChangeText={
                  handleSearch
              }
              placeholder="Search Employee..."
              placeholderTextColor="#999"
              style={styles.searchBar}
          />

      <FlatList
        data={filteredRequests}
        keyExtractor={(
          item,
          index
        ) =>
          item._id ||
          index.toString()
        }
        renderItem={
          renderItem
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No WFH requests found
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              onRefresh
            }
          />
        }
      />

    </View>
  );
}

const styles =
  StyleSheet.create({

      searchBar: {

          backgroundColor:
              '#121f45',

          color: '#fff',

          borderRadius: 12,

          paddingHorizontal: 15,

          height: 50,

          marginBottom: 15,

      },

    container: {
      flex: 1,
      backgroundColor:
        '#081029',
      padding: 15,
    },

    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 20,
    },

    card: {
      backgroundColor:
        '#121f45',
      padding: 15,
      borderRadius: 15,
      marginBottom: 15,
    },

    name: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },

    info: {
      color: '#ccc',
      marginTop: 5,
    },

    reason: {
      color: '#fff',
      marginTop: 10,
    },

    status: {
      marginTop: 10,
      fontWeight: 'bold',
      fontSize: 16,
    },

    buttonRow: {
      flexDirection: 'row',
      marginTop: 15,
      justifyContent:
        'space-between',
    },

    approveBtn: {
      backgroundColor:
        '#00c853',
      padding: 10,
      borderRadius: 10,
      width: '48%',
      alignItems: 'center',
    },

    rejectBtn: {
      backgroundColor:
        '#ff1744',
      padding: 10,
      borderRadius: 10,
      width: '48%',
      alignItems: 'center',
    },

    btnText: {
      color: '#fff',
      fontWeight: 'bold',
    },

    emptyCard: {
      backgroundColor:
        '#121f45',
      padding: 24,
      borderRadius: 15,
      alignItems: 'center',
    },

    emptyText: {
      color: '#ccc',
      fontSize: 16,
    },

    loadingContainer: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
    },
  });
