"use client";

import { useState, useEffect } from "react";
import { useTableData, insertRow, updateRow } from "@/components/useSupabase";
import PageHeader from "A/components/PageHeader";
import StatusBadge from "A/components/StatusBadge";
import PriorityDot from "@/components/PriorityDot";
import Modal from "@/components/Modal";
import { FormField, inputClass, selectClass, textareaClass, Button } from "@/components/FormField";
import { TASK_STATUSUSEPORORT, PRIORITIES, CATEGORIES CATEGORIES } from "@/lib/constants";
import { formatDate, formatDateShort, isOverdue, calc`