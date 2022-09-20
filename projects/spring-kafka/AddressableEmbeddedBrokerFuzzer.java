// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in co  mpliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
//////////////////////////////////////////////////////////////////////////////////


import com.code_intelligence.jazzer.api.FuzzedDataProvider;
import com.code_intelligence.jazzer.api.FuzzerSecurityIssueLow;

import org.springframework.kafka.test.rule.*;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.net.ServerSocket;
import java.util.Map;
import java.util.concurrent.BrokenBarrierException;
import java.util.HashMap;
import java.util.Collections;

import javax.net.ServerSocketFactory;

import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.test.EmbeddedKafkaBroker;
import org.springframework.kafka.test.utils.KafkaTestUtils;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
// import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;



// @SpringJUnitConfig
// @DirtiesContext
// @EmbeddedKafka(topics = { "singleTopic1", "singleTopic2", "singleTopic3", "singleTopic4", "singleTopic5", "multiTopic1" })
// @EmbeddedKafka(partitions = 1, brokerProperties = { "listeners=PLAINTEXT://localhost:9092", "port=9092" })
// @KafkaListener(properties = "auto.offset.reset:earliest")
@EmbeddedKafka(topics = { AddressableEmbeddedBrokerFuzzer.TEST_EMBEDDED }, partitions = 1)
public class AddressableEmbeddedBrokerFuzzer {
	static final String TEST_EMBEDDED = "testEmbedded";

    // @Autowired
    static EmbeddedKafkaBroker embeddedKafkaBroker;
	
	static Consumer<Integer, String> consumer;
	static Producer<Integer, String> producer;

	public static void fuzzerInitialize() {
		int kafkaPort;
		int zkPort;

		try {
			// ServerSocket ss = ServerSocketFactory.getDefault().createServerSocket(0);
			// kafkaPort = ss.getLocalPort();
			// ss.close();
			// ss = ServerSocketFactory.getDefault().createServerSocket(0);
			// zkPort = ss.getLocalPort();
			// ss.close();

			embeddedKafkaBroker = new EmbeddedKafkaBroker(1, true, TEST_EMBEDDED);
		} catch (Exception e) {
			throw new FuzzerSecurityIssueLow("ERROR!!");
		}
		
		Map<String, Object> consumerProps = KafkaTestUtils.consumerProps(TEST_EMBEDDED, "false", embeddedKafkaBroker);
		// consumerProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
		// consumerProps.put(ConsumerConfig.CONNECTIONS_MAX_IDLE_MS_CONFIG, 1);
		// consumerProps.put(ConsumerConfig.DEFAULT_API_TIMEOUT_MS_CONFIG, 1);
		// consumerProps.put(ConsumerConfig.DEFAULT_API_TIMEOUT_MS_CONFIG, 1);
		// Consumer<Integer, String> consumer = new KafkaConsumer<>(consumerProps);
		consumer = new DefaultKafkaConsumerFactory<Integer, String>(consumerProps).createConsumer();
		consumer.subscribe(Collections.singleton(TEST_EMBEDDED));
		// embeddedKafkaBroker.consumeFromAnEmbeddedTopic(consumer, TEST_EMBEDDED);

		

		Map<String, Object> producerProps = new HashMap<>(KafkaTestUtils.producerProps(embeddedKafkaBroker));
		// producerProps.put(ProducerConfig.CONNECTIONS_MAX_IDLE_MS_CONFIG, 1);
		// producerProps.put(ProducerConfig.DELIVERY_TIMEOUT_MS_CONFIG, 1);
		producerProps.put(ProducerConfig.MAX_BLOCK_MS_CONFIG, 1);
		// producerProps.put(ProducerConfig.REQUEST_TIMEOUT_MS_CONFIG, 1);
		producer = new DefaultKafkaProducerFactory<Integer, String>(producerProps).createProducer();
	}

	// https://stackoverflow.com/questions/48753051/simple-embedded-kafka-test-example-with-spring-boot
	// https://blog.mimacom.com/testing-apache-kafka-with-spring-boot-junit5/
	// https://stackoverflow.com/questions/53706400/kafka-consumer-returns-no-records
	// https://kafka.apache.org/32/javadoc/org/apache/kafka/clients/producer/ProducerConfig.html
	// https://kafka.apache.org/32/javadoc/org/apache/kafka/clients/consumer/ConsumerConfig.html
	// https://docs.spring.io/spring-kafka/api/org/springframework/kafka/test/EmbeddedKafkaBroker.html
	// https://github.com/spring-projects/spring-kafka/blob/main/spring-kafka-test/src/test/java/org/springframework/kafka/test/rule/AddressableEmbeddedBrokerTests.java


    public static void fuzzerTestOneInput(FuzzedDataProvider data) {
        // String str = data.consumeString(1000);
        // String str1 = data.consumeString(1000);
        String str2 = data.consumeRemainingAsString();

		// Map<String, Object> consumerProps = KafkaTestUtils.consumerProps(TEST_EMBEDDED, "true", embeddedKafkaBroker);
		// consumerProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
		// // Consumer<Integer, String> consumer = new KafkaConsumer<>(consumerProps);
		// Consumer<Integer, String> consumer = new DefaultKafkaConsumerFactory<Integer, String>(consumerProps).createConsumer();
		// consumer.subscribe(Collections.singleton(TEST_EMBEDDED));
		// // embeddedKafkaBroker.consumeFromAnEmbeddedTopic(consumer, TEST_EMBEDDED);

		// Map<String, Object> producerProps = new HashMap<>(KafkaTestUtils.producerProps(embeddedKafkaBroker));
		// // producerProps.put(ProducerConfig.CONNECTIONS_MAX_IDLE_MS_CONFIG, 1);
		// // producerProps.put(ProducerConfig.DELIVERY_TIMEOUT_MS_CONFIG, 1);
		// producerProps.put(ProducerConfig.MAX_BLOCK_MS_CONFIG, 0);
		// // producerProps.put(ProducerConfig.REQUEST_TIMEOUT_MS_CONFIG, 1);
		// Producer<Integer, String> producer = new DefaultKafkaProducerFactory<Integer, String>(producerProps).createProducer();
		// producer.send(new ProducerRecord<>(str1, str2));
		producer.send(new ProducerRecord<>(TEST_EMBEDDED, 123, str2));
		// producer.close();

		// producer.send(new ProducerRecord<>(TEST_TOPIC, 1, "foo"));
		// KafkaTestUtils.getSingleRecord(consumer, TEST_EMBEDDED);
		



		// embeddedKafkaBroker = new EmbeddedKafkaBroker(1);
		// Consumer<Integer, String> consumer = configureConsumer();
        // Producer<Integer, String> producer = configureProducer();

        // producer.send(new ProducerRecord<>(TEST_TOPIC, 1, "str2"));
		// producer.close();

        // ConsumerRecord<Integer, String> singleRecord = KafkaTestUtils.getSingleRecord(consumer, TEST_EMBEDDED);
        // assertThat(singleRecord).isNotNull();
        // assertThat(singleRecord.key()).isEqualTo(123);
        // assertThat(singleRecord.value()).isEqualTo("my-test-value");

        // consumer.close();
        // producer.close();

    }

    // private static Consumer<Integer, String> configureConsumer() {
    //     Map<String, Object> consumerProps = KafkaTestUtils.consumerProps(TEST_EMBEDDED, "false", embeddedKafkaBroker);
    //     consumerProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
	// 	// consumerProps.put(ConsumerConfig.REQUEST_TIMEOUT_MS_CONFIG, 1);
    //     Consumer<Integer, String> consumer = new DefaultKafkaConsumerFactory<Integer, String>(consumerProps).createConsumer();
	// 	// Consumer<Integer, String> consumer = new KafkaConsumer<>(consumerProps);
    //     consumer.subscribe(Collections.singleton(TEST_TOPIC));
    //     return consumer;
    // }

    // private static Producer<Integer, String> configureProducer() {
    //     Map<String, Object> producerProps = new HashMap<>(KafkaTestUtils.producerProps(embeddedKafkaBroker));
    //     producerProps.put(ProducerConfig.REQUEST_TIMEOUT_MS_CONFIG, 1);
	// 	return new DefaultKafkaProducerFactory<Integer, String>(producerProps).createProducer();
    // }

}