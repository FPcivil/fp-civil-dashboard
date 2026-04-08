"use client";

import { useState } from "react";
import { useTableData, insertRow } from "@/hooks/useSupabase";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "A/components/StatusBadge";
import PriorityDot from "@/components/PriorityDot";
import Modal from "@/components/Modal";
import { FormField, inputClass, selectClass, textareaClass, Button } from "@/components/FormField";
import { ISSUE_STATUSES, ISSUE_CATE