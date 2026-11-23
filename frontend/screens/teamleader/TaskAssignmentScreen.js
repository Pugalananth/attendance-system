import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import AppHeader from '../../components/ui/AppHeader';
import InputField from '../../components/InputField';
import GradientButton from '../../components/GradientButton';

export default function TaskAssignmentScreen({ navigation }) {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Monthly Report', assignedTo: 'John Doe', status: 'In Progress', priority: 'High' },
    { id: '2', title: 'Face Recognition Test', assignedTo: 'Alice Smith', status: 'Pending', priority: 'Medium' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const handleCreateTask = () => {
    if (!newTitle || !assignedTo) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      title: newTitle,
      assignedTo: assignedTo,
      status: 'Pending',
      priority: 'Medium',
    };
    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setAssignedTo('');
    setShowAdd(false);
    Alert.alert('Success', 'Task assigned successfully');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Work Assignment" showBack navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {!showAdd ? (
          <TouchableOpacity style={styles.addCard} onPress={() => setShowAdd(true)}>
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            <Text style={styles.addText}>Create New Task</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Assign New Task</Text>
            <InputField label="Task Title" value={newTitle} onChangeText={setNewTitle} placeholder="What needs to be done?" />
            <InputField label="Assign To" value={assignedTo} onChangeText={setAssignedTo} placeholder="Employee name or ID" />
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAdd(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <GradientButton title="Create Task" onPress={handleCreateTask} size="sm" />
              </View>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Active Tasks</Text>
        {tasks.map(item => (
          <View key={item.id} style={styles.taskItem}>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskMeta}>To: {item.assignedTo} • {item.priority} Priority</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'Pending' ? COLORS.warning + '15' : COLORS.primary + '15' }]}>
              <Text style={[styles.statusText, { color: item.status === 'Pending' ? COLORS.warning : COLORS.primary }]}>{item.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16 },
  addCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 12, borderStyle: 'dashed', borderWidth: 2, borderColor: COLORS.primary, marginBottom: 20 },
  addText: { marginLeft: 10, fontSize: 15, fontWeight: '700', color: COLORS.primary },
  formCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, ...SHADOWS.sm, marginBottom: 20 },
  formTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 15 },
  formActions: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  cancelBtn: { paddingHorizontal: 20 },
  cancelText: { color: COLORS.textSecondary, fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 15 },
  taskItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 10, ...SHADOWS.sm },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  taskMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  statusText: { fontSize: 11, fontWeight: '700' },
});
