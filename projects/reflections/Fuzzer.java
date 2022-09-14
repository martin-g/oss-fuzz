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

import org.reflections.Reflections;
import org.reflections.scanners.FieldAnnotationsScanner;
import org.reflections.scanners.MemberUsageScanner;
import org.reflections.scanners.MethodAnnotationsScanner;
import org.reflections.scanners.MethodParameterNamesScanner;
import org.reflections.scanners.ResourcesScanner;
import org.reflections.scanners.Scanners;
import org.reflections.scanners.SubTypesScanner;
import org.reflections.scanners.TypeAnnotationsScanner;
import org.reflections.util.ClasspathHelper;
import org.reflections.util.ConfigurationBuilder;
import org.reflections.util.FilterBuilder;
import org.reflections.util.NameHelper;

import java.io.File;
import java.lang.annotation.Annotation;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import static java.lang.annotation.RetentionPolicy.*;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.function.Predicate;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;


public class Fuzzer {
    private static final FilterBuilder TestModelFilter = new FilterBuilder()
            .includePattern("org\\.reflections\\.TestModel\\$.*")
            .includePattern("org\\.reflections\\.UsageTestModel\\$.*");

    static Reflections reflections;

    public interface TestModel {
        public @Retention(RUNTIME) @Inherited @interface MAI1 {}
        public @Retention(RUNTIME) @MAI1 @interface AI1 {}
        public @AI1 interface I1 {}
        public @Retention(RUNTIME) @Inherited @interface AI2 {}
        public @AI2 interface I2 extends I1 {}

        public @Retention(RUNTIME) @Inherited @interface AC1 {}
        public @Retention(RUNTIME) @interface AC1n {}
        public @AC1 @AC1n class C1 implements I2 {}
        public @Retention(RUNTIME) @interface AC2 {
            public abstract String value();
        }

        public @AC2("") class C2 extends C1 {}
        public @AC2("ac2") class C3 extends C1 {}

        public @Retention(RUNTIME) @interface AM1 {
            public abstract String value();
        }
        public @interface AM2 {}
        public @Retention(RUNTIME) @interface AF1 {
            public abstract String value();
        }
        public class C4 {
            @AF1("1") private String f1;
            @AF1("2") protected String f2;
            protected String f3;

            public C4() { }
            @AM1("1") public C4(@AM1("1") String f1) { this.f1 = f1; }

            @AM1("1") protected void m1() {}
            @AM1("1") public void m1(int integer, @AM2 String... strings) {}
            @AM1("1") public void m1(int[][] integer, String[][] strings) {}
            @AM1("2") public String m3() {return null;}
            public String m4(@AM1("2") @AM2 String string) {return null;}
            public C3 c2toC3(C2 c2) {return null;}
            public int add(int i1, int i2) { return i1+i2; }
        }

        public class C5 extends C3 {}
        public @AC2("ac2") interface I3 {}
        public class C6 implements I3 {}

        public @AC2("ac2") @interface AC3 { } // not @Retention(RUNTIME)
        public @AC3 class C7 {}
    }

    public static void fuzzerInitialize() {
                reflections = new Reflections(new ConfigurationBuilder()
                .setUrls(Collections.singletonList(ClasspathHelper.forClass(TestModel.class)))
                .filterInputsBy(TestModelFilter)
                .setScanners(
                        new SubTypesScanner(),
                        new TypeAnnotationsScanner(),
                        new MethodAnnotationsScanner(),
                        new FieldAnnotationsScanner(),
                        Scanners.ConstructorsAnnotated,
                        Scanners.MethodsParameter,
                        Scanners.MethodsSignature,
                        Scanners.MethodsReturn,
                        Scanners.ConstructorsParameter,
                        Scanners.ConstructorsSignature,
                        new ResourcesScanner(),
                        new MethodParameterNamesScanner(),
                        new MemberUsageScanner()));
    }

    public static void fuzzerTestOneInput(FuzzedDataProvider data) {

        String str = data.consumeString(1000);
        String str1 = data.consumeString(1000);
        String str2 = data.consumeString(1000);
        String str3 = data.consumeRemainingAsString();

        try {
            Predicate<String> filter = new FilterBuilder().includePattern(str).excludePattern(str1);
            Reflections reflections = new Reflections(new ConfigurationBuilder()
                    .filterInputsBy(filter)
                    .setScanners(Scanners.Resources)
                    .setUrls(Collections.singletonList(ClasspathHelper.forClass(TestModel.class))));

            Collection<String> resolved = reflections.getResources(str2);
//        assertThat(resolved, are("META-INF/reflections/resource1-reflections.xml"));

            Collection<String> resources = reflections.getResources(str3);
//        assertThat(resources, are("META-INF/reflections/resource1-reflections.xml", "META-INF/reflections/inner/resource2-reflections.xml"));
        } catch (java.util.regex.PatternSyntaxException e) {
        }

    }
}



















