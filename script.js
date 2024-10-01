 const parkingSlots = [
            { id: 1, status: "booked", type: "car" },
            { id: 2, status: "free", type: "motorcycle" },
            { id: 3, status: "free", type: "car" },
        ];

        const parkingSlotsContainer = document.getElementById("parkingSlots");
        const bookingModal = document.getElementById("bookingModal");

       function updateParkingSlots() {
    parkingSlotsContainer.innerHTML = "";
    parkingSlots.forEach(slot => {
        const slotDiv = document.createElement("div");
        slotDiv.className = `bg-white rounded-lg shadow-md p-6 cursor-pointer transition-colors ${slot.status === "booked" ? "border-4 border-red-500" : "border-4 border-green-500"}`;
        slotDiv.onclick = () => handleSlotClick(slot);
        slotDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold">Slot ${slot.id}</h3>
                <span class="px-2 py-1 rounded-full text-white text-sm ${slot.status === "booked" ? "bg-red-500" : "bg-green-500"}">
                    ${slot.status === "booked" ? "Booked" : "Free"}
                </span>
            </div>
            <div class="flex items-center mt-2">
                <span class="text-gray-500">Vehicle Type: ${slot.type}</span>
            </div>
        `;
        parkingSlotsContainer.appendChild(slotDiv);
        // Firebase listener for slot status
        database.ref(`parking_space/slot${slot.id}/status`).on("value", function(snapshot) {
            slot.status = snapshot.val();
            updateParkingSlots(); // Refresh the slots display
        });
    });
}

        function handleSlotClick(slot) {
            if (slot.status === "free") {
                bookingModal.classList.remove("hidden");
                document.getElementById("name").value = ""; // Reset name input
                document.getElementById("date").value = ""; // Reset date input
                document.getElementById("time").value = ""; // Reset time input
            }
        }

       function updateSlotAvailability(slotId, status) {
    const statusBox = document.getElementById(`${slotId}-status`);
    const bookBtn = document.getElementById(`${slotId}-book-btn`);
    const cancelBtn = document.getElementById(`${slotId}-cancel-btn`);
    const datetimeInput = document.getElementById(`${slotId}-datetime`);

    statusBox.textContent = status;

    if (status.toLowerCase() === "free") {
        statusBox.classList.add('free');
        statusBox.classList.remove('occupied');
        bookBtn.disabled = false;
        cancelBtn.style.display = 'none';
        datetimeInput.style.display = 'none';

        bookBtn.addEventListener("click", function() {
            datetimeInput.style.display = 'block';
            flatpickr(`#${slotId}-datetime`, {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                minDate: "today",
                onChange: function(selectedDates, dateStr) {
                    bookSlot(slotId, dateStr);
                }
            });
        });

    } else {
        statusBox.classList.add('occupied');
        statusBox.classList.remove('free');
        bookBtn.disabled = true;
        datetimeInput.style.display = 'none';
        cancelBtn.style.display = 'block';

        cancelBtn.addEventListener("click", function() {
            cancelBooking(slotId);
        });
    }
}

function bookSlot(slotId, dateStr) {
    const slotRef = database.ref(`parking_space/${slotId}/booking`);
    slotRef.set({
        date: dateStr,
        status: "Booked"
    });
    alert(`Slot ${slotId} booked for ${dateStr}`);
}

function cancelBooking(slotId) {
    const slotRef = database.ref(`parking_space/${slotId}/booking`);
    slotRef.set({
        date: null,
        status: "free"
    });
    alert(`Slot ${slotId} booking has been canceled.`);
}

        function closeModal() {
            bookingModal.classList.add("hidden");
        }

        let gateStatus = "closed";
        const toggleGateButton = document.getElementById("toggleGateButton");
        toggleGateButton.onclick = () => {
            gateStatus = gateStatus === "closed" ? "open" : "closed";
            toggleGateButton.innerText = gateStatus === "closed" ? "Close Gate" : "Open Gate";
        };

        // Initialize the parking slots display
        updateParkingSlots();
